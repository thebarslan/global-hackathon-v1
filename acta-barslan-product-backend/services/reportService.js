const Report = require("../models/Report");
const Analysis = require("../models/Analysis");
const fs = require("fs").promises;
const path = require("path");

class ReportService {
   constructor() {
      this.reportsDir = path.join(__dirname, "../reports");
      this.ensureReportsDir();
   }

   async ensureReportsDir() {
      try {
         await fs.access(this.reportsDir);
      } catch {
         await fs.mkdir(this.reportsDir, { recursive: true });
      }
   }

   async generateReport(reportId) {
      try {
         const report = await Report.findById(reportId);
         if (!report) {
            throw new Error("Report not found");
         }

         console.log(`Starting report generation for report ${reportId}`);

         // Update status to generating
         report.status = "generating";
         await report.save();

         // Get analysis data
         const analysis = await Analysis.findById(report.analysisId);
         if (!analysis) {
            throw new Error("Analysis not found");
         }

         // Generate charts data
         const charts = await this.generateCharts(analysis);

         // Generate insights
         const insights = await this.generateInsights(analysis);

         // Update report with generated data
         report.charts = charts;
         report.insights = insights;

         // Generate PDF file
         const fileName = `report_${reportId}_${Date.now()}.pdf`;
         const filePath = path.join(this.reportsDir, fileName);

         // Create a simple PDF content (in real implementation, use a PDF library like puppeteer)
         const pdfContent = await this.generatePDFContent(report, analysis);
         await fs.writeFile(filePath, pdfContent);

         // Update report with file info
         report.status = "completed";
         report.completedAt = new Date();
         report.filePath = filePath;
         report.downloadUrl = `/api/reports/${reportId}/download`;
         report.metadata = {
            generationTime: Date.now() - report.createdAt.getTime(),
            fileSize: (await fs.stat(filePath)).size,
            chartCount: charts.length,
            insightCount: insights.length,
         };

         await report.save();

         console.log(`Report ${reportId} generated successfully`);
         return report;
      } catch (error) {
         console.error(`Report generation failed for ${reportId}:`, error);

         // Update report status to failed
         await Report.findByIdAndUpdate(reportId, {
            status: "failed",
            error: {
               message: error.message,
               code: "GENERATION_ERROR",
               timestamp: new Date(),
            },
         });

         throw error;
      }
   }

   async generateCharts(analysis) {
      const charts = [];

      // Sentiment distribution pie chart
      const sentimentCounts = {
         positive: analysis.sentimentResults.filter(
            (r) => r.sentiment === "positive"
         ).length,
         neutral: analysis.sentimentResults.filter(
            (r) => r.sentiment === "neutral"
         ).length,
         negative: analysis.sentimentResults.filter(
            (r) => r.sentiment === "negative"
         ).length,
         mixed: analysis.sentimentResults.filter((r) => r.sentiment === "mixed")
            .length,
      };

      charts.push({
         id: "sentiment_pie",
         type: "sentiment_pie",
         title: "Sentiment Distribution",
         data: sentimentCounts,
         config: {
            colors: {
               positive: "#10B981",
               neutral: "#3B82F6",
               negative: "#EF4444",
               mixed: "#F59E0B",
            },
         },
      });

      // Top keywords chart
      const keywordCounts = {};
      analysis.sentimentResults.forEach((result) => {
         result.keywords.forEach((keyword) => {
            keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
         });
      });

      const topKeywords = Object.entries(keywordCounts)
         .sort(([, a], [, b]) => b - a)
         .slice(0, 10)
         .map(([keyword, count]) => ({ keyword, frequency: count }));

      charts.push({
         id: "keyword_cloud",
         type: "keyword_cloud",
         title: "Top Keywords",
         data: topKeywords,
         config: {
            maxWords: 20,
         },
      });

      // Subreddit distribution
      const subredditCounts = {};
      analysis.sentimentResults.forEach((result) => {
         if (result.subreddit) {
            subredditCounts[result.subreddit] =
               (subredditCounts[result.subreddit] || 0) + 1;
         }
      });

      const topSubreddits = Object.entries(subredditCounts)
         .sort(([, a], [, b]) => b - a)
         .slice(0, 5)
         .map(([subreddit, count]) => ({ subreddit, posts: count }));

      charts.push({
         id: "subreddit_distribution",
         type: "subreddit_distribution",
         title: "Top Subreddits",
         data: topSubreddits,
         config: {
            showPercentage: true,
         },
      });

      return charts;
   }

   async generateInsights(analysis) {
      const insights = [];
      const sentimentCounts = {
         positive: analysis.sentimentResults.filter(
            (r) => r.sentiment === "positive"
         ).length,
         neutral: analysis.sentimentResults.filter(
            (r) => r.sentiment === "neutral"
         ).length,
         negative: analysis.sentimentResults.filter(
            (r) => r.sentiment === "negative"
         ).length,
         mixed: analysis.sentimentResults.filter((r) => r.sentiment === "mixed")
            .length,
      };

      const totalPosts = analysis.sentimentResults.length;
      const positiveRatio = sentimentCounts.positive / totalPosts;
      const negativeRatio = sentimentCounts.negative / totalPosts;

      // Positive sentiment insight
      if (positiveRatio > 0.6) {
         insights.push({
            id: "positive_trend",
            type: "trend",
            title: "Strong Positive Sentiment",
            description: `The analysis shows a strong positive sentiment with ${Math.round(
               positiveRatio * 100
            )}% of posts being positive. This indicates favorable brand perception.`,
            severity: "medium",
            confidence: Math.min(positiveRatio, 0.9),
         });
      }

      // Negative sentiment insight
      if (negativeRatio > 0.4) {
         insights.push({
            id: "negative_concern",
            type: "warning",
            title: "High Negative Sentiment Detected",
            description: `The analysis reveals a concerning ${Math.round(
               negativeRatio * 100
            )}% negative sentiment. Immediate attention may be required to address brand perception issues.`,
            severity: "high",
            confidence: Math.min(negativeRatio, 0.9),
         });
      }

      // Neutral sentiment insight
      const neutralRatio = sentimentCounts.neutral / totalPosts;
      if (neutralRatio > 0.7) {
         insights.push({
            id: "neutral_opportunity",
            type: "recommendation",
            title: "High Neutral Sentiment - Engagement Opportunity",
            description: `With ${Math.round(
               neutralRatio * 100
            )}% neutral sentiment, there's a significant opportunity to engage users and improve brand perception through targeted campaigns.`,
            severity: "medium",
            confidence: 0.8,
         });
      }

      // Confidence insight
      const avgConfidence =
         analysis.sentimentResults.reduce((sum, r) => sum + r.confidence, 0) /
         totalPosts;
      if (avgConfidence < 70) {
         insights.push({
            id: "low_confidence",
            type: "warning",
            title: "Low Analysis Confidence",
            description: `The sentiment analysis shows low confidence (${Math.round(
               avgConfidence
            )}%). Consider analyzing more posts or refining keywords for better accuracy.`,
            severity: "medium",
            confidence: 0.7,
         });
      }

      return insights;
   }

   async generatePDFContent(report, analysis) {
      // Simple HTML content that can be converted to PDF
      // In a real implementation, use puppeteer or similar to generate actual PDF
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${report.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .chart { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .insight { margin: 15px 0; padding: 10px; background: #f5f5f5; }
        .metric { display: inline-block; margin: 10px 20px 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${report.title}</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <div class="metric"><strong>Total Posts:</strong> ${
           report.summary.totalPosts
        }</div>
        <div class="metric"><strong>Analyzed Posts:</strong> ${
           report.summary.analyzedPosts
        }</div>
        <div class="metric"><strong>Average Sentiment:</strong> ${
           report.summary.averageSentiment
        }</div>
        <div class="metric"><strong>Sentiment Score:</strong> ${
           report.summary.sentimentScore
        }%</div>
    </div>
    
    <div class="section">
        <h2>Sentiment Distribution</h2>
        <div class="chart">
            <p><strong>Positive:</strong> ${
               report.summary.sentimentDistribution.positive
            } posts</p>
            <p><strong>Neutral:</strong> ${
               report.summary.sentimentDistribution.neutral
            } posts</p>
            <p><strong>Negative:</strong> ${
               report.summary.sentimentDistribution.negative
            } posts</p>
            <p><strong>Mixed:</strong> ${
               report.summary.sentimentDistribution.mixed
            } posts</p>
        </div>
    </div>
    
    <div class="section">
        <h2>Key Insights</h2>
        ${report.insights
           .map(
              (insight) => `
            <div class="insight">
                <h3>${insight.title}</h3>
                <p>${insight.description}</p>
                <p><em>Confidence: ${Math.round(
                   insight.confidence * 100
                )}%</em></p>
            </div>
        `
           )
           .join("")}
    </div>
    
    <div class="section">
        <h2>Charts</h2>
        ${report.charts
           .map(
              (chart) => `
            <div class="chart">
                <h3>${chart.title}</h3>
                <p>Chart data available for visualization</p>
            </div>
        `
           )
           .join("")}
    </div>
</body>
</html>`;

      return htmlContent;
   }

   async downloadReport(reportId) {
      const report = await Report.findById(reportId);
      if (!report) {
         throw new Error("Report not found");
      }

      if (report.status !== "completed") {
         throw new Error("Report is not ready for download");
      }

      if (!report.filePath) {
         throw new Error("Report file not found");
      }

      return {
         filePath: report.filePath,
         fileName: `${report.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
         downloadUrl: report.downloadUrl,
      };
   }
}

module.exports = new ReportService();
