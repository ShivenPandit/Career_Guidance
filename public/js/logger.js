/**
 * Comprehensive Logging System for Career Guidance Application
 * 
 * This logging system captures all user actions and system operations
 * as required by the project specifications.
 * 
 * Features:
 * - Multiple log levels (DEBUG, INFO, WARN, ERROR)
 * - User action tracking
 * - System performance monitoring  
 * - Local storage for persistence
 * - Error reporting and analytics
 * - Structured logging with metadata
 */

class CareerGuidanceLogger {
    constructor() {
        this.logLevel = 'INFO';
        this.maxLogEntries = 1000;
        this.sessionId = this.generateSessionId();
        this.userId = null;
        this.startTime = Date.now();
        
        // Initialize logging infrastructure
        this.initializeLogger();
        
        // Log system startup
        this.info('Logging system initialized', {
            sessionId: this.sessionId,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    }
    
    initializeLogger() {
        // Set up error handling
        window.addEventListener('error', (event) => {
            this.error('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error?.stack
            });
        });
        
        // Set up unhandled promise rejection logging
        window.addEventListener('unhandledrejection', (event) => {
            this.error('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });
        
        // Set up performance monitoring
        if ('performance' in window) {
            this.monitorPerformance();
        }
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.info('Page Visibility Changed', {
                hidden: document.hidden,
                visibilityState: document.visibilityState
            });
        });
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    setUserId(userId) {
        this.userId = userId;
        this.info('User ID set', { userId });
    }
    
    // Core logging methods
    debug(message, metadata = {}) {
        this.log('DEBUG', message, metadata);
    }
    
    info(message, metadata = {}) {
        this.log('INFO', message, metadata);
    }
    
    warn(message, metadata = {}) {
        this.log('WARN', message, metadata);
    }
    
    error(message, metadata = {}) {
        this.log('ERROR', message, metadata);
    }
    
    // Main logging function
    log(level, message, metadata = {}) {
        const logEntry = {
            level,
            message,
            metadata: {
                ...metadata,
                sessionId: this.sessionId,
                userId: this.userId,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            }
        };
        
        // Console output
        this.outputToConsole(logEntry);
        
        // Store in localStorage
        this.storeLogEntry(logEntry);
        
        // Send to analytics (if configured)
        this.sendToAnalytics(logEntry);
    }
    
    outputToConsole(logEntry) {
        const { level, message, metadata } = logEntry;
        const timestamp = new Date(metadata.timestamp).toLocaleTimeString();
        
        switch (level) {
            case 'DEBUG':
                console.debug(`[${timestamp}] DEBUG: ${message}`, metadata);
                break;
            case 'INFO':
                console.info(`[${timestamp}] INFO: ${message}`, metadata);
                break;
            case 'WARN':
                console.warn(`[${timestamp}] WARN: ${message}`, metadata);
                break;
            case 'ERROR':
                console.error(`[${timestamp}] ERROR: ${message}`, metadata);
                break;
        }
    }
    
    storeLogEntry(logEntry) {
        try {
            const logs = JSON.parse(localStorage.getItem('careerGuidanceLogs') || '[]');
            logs.push(logEntry);
            
            // Maintain max entries limit
            if (logs.length > this.maxLogEntries) {
                logs.splice(0, logs.length - this.maxLogEntries);
            }
            
            localStorage.setItem('careerGuidanceLogs', JSON.stringify(logs));
        } catch (error) {
            console.error('Failed to store log entry:', error);
        }
    }
    
    sendToAnalytics(logEntry) {
        // In production, send to analytics service
        // For demo, we'll just track critical events
        if (logEntry.level === 'ERROR' || logEntry.metadata.action) {
            // Could integrate with Google Analytics, Firebase Analytics, etc.
            console.log('Analytics Event:', logEntry);
        }
    }
    
    // User Action Tracking Methods
    trackUserAction(action, details = {}) {
        this.info(`User Action: ${action}`, {
            action,
            details,
            actionType: 'user_interaction'
        });
    }
    
    trackPageView(page, title = '') {
        this.info(`Page View: ${page}`, {
            page,
            title,
            actionType: 'page_view',
            referrer: document.referrer
        });
    }
    
    trackAuthentication(action, method, success = true) {
        this.info(`Authentication: ${action}`, {
            action,
            method,
            success,
            actionType: 'authentication'
        });
    }
    
    trackFormSubmission(formName, success = true, errors = []) {
        this.info(`Form Submission: ${formName}`, {
            formName,
            success,
            errors,
            actionType: 'form_submission'
        });
    }
    
    trackAPICall(endpoint, method, statusCode, responseTime) {
        this.info(`API Call: ${method} ${endpoint}`, {
            endpoint,
            method,
            statusCode,
            responseTime,
            actionType: 'api_call'
        });
    }
    
    trackError(errorType, errorMessage, context = {}) {
        this.error(`${errorType}: ${errorMessage}`, {
            errorType,
            errorMessage,
            context,
            actionType: 'error'
        });
    }
    
    // Performance monitoring
    monitorPerformance() {
        // Track page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.info('Page Performance', {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        totalLoadTime: perfData.loadEventEnd - perfData.navigationStart,
                        actionType: 'performance'
                    });
                }
            }, 0);
        });
    }
    
    // Business Logic Tracking
    trackCollegeSearch(searchParams, resultCount) {
        this.info('College Search Performed', {
            searchParams,
            resultCount,
            actionType: 'search'
        });
    }
    
    trackCollegeSelection(collegeId, collegeName) {
        this.info('College Selected', {
            collegeId,
            collegeName,
            actionType: 'selection'
        });
    }
    
    trackTestAttempt(testType, questionsCount) {
        this.info('Test Started', {
            testType,
            questionsCount,
            actionType: 'test_attempt'
        });
    }
    
    trackTestCompletion(testType, score, timeTaken) {
        this.info('Test Completed', {
            testType,
            score,
            timeTaken,
            actionType: 'test_completion'
        });
    }
    
    trackCareerSelection(careerField, reasons = []) {
        this.info('Career Field Selected', {
            careerField,
            reasons,
            actionType: 'career_selection'
        });
    }
    
    // Data export and management
    exportLogs(format = 'json') {
        const logs = JSON.parse(localStorage.getItem('careerGuidanceLogs') || '[]');
        
        switch (format) {
            case 'json':
                return JSON.stringify(logs, null, 2);
            case 'csv':
                return this.convertLogsToCSV(logs);
            default:
                return logs;
        }
    }
    
    convertLogsToCSV(logs) {
        if (logs.length === 0) return '';
        
        const headers = ['Level', 'Message', 'Timestamp', 'User ID', 'Session ID', 'URL', 'Action Type'];
        const csvRows = [headers.join(',')];
        
        logs.forEach(log => {
            const row = [
                log.level,
                `"${log.message.replace(/"/g, '""')}"`,
                log.metadata.timestamp,
                log.metadata.userId || '',
                log.metadata.sessionId,
                `"${log.metadata.url}"`,
                log.metadata.actionType || ''
            ];
            csvRows.push(row.join(','));
        });
        
        return csvRows.join('\n');
    }
    
    clearLogs() {
        localStorage.removeItem('careerGuidanceLogs');
        this.info('Logs cleared');
    }
    
    getLogStats() {
        const logs = JSON.parse(localStorage.getItem('careerGuidanceLogs') || '[]');
        const stats = {
            totalLogs: logs.length,
            errorCount: logs.filter(log => log.level === 'ERROR').length,
            warnCount: logs.filter(log => log.level === 'WARN').length,
            infoCount: logs.filter(log => log.level === 'INFO').length,
            debugCount: logs.filter(log => log.level === 'DEBUG').length,
            sessionLogs: logs.filter(log => log.metadata.sessionId === this.sessionId).length,
            userActions: logs.filter(log => log.metadata.actionType).length
        };
        
        return stats;
    }
    
    // Integration with existing notification system
    createLogViewer() {
        const logs = JSON.parse(localStorage.getItem('careerGuidanceLogs') || '[]');
        const recentLogs = logs.slice(-50); // Show last 50 logs
        
        const logViewer = document.createElement('div');
        logViewer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 400px;
            max-height: 500px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            overflow-y: auto;
            z-index: 10000;
            font-family: monospace;
            font-size: 12px;
        `;
        
        logViewer.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <h3 style="margin: 0;">Debug Logs</h3>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
            <div>
                ${recentLogs.map(log => `
                    <div style="margin: 5px 0; padding: 5px; background: ${this.getLevelColor(log.level)};">
                        <strong>[${log.level}]</strong> ${log.message}
                        <br><small>${new Date(log.metadata.timestamp).toLocaleString()}</small>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(logViewer);
        return logViewer;
    }
    
    getLevelColor(level) {
        switch (level) {
            case 'ERROR': return '#ffebee';
            case 'WARN': return '#fff3e0';
            case 'INFO': return '#e3f2fd';
            case 'DEBUG': return '#f1f8e9';
            default: return '#ffffff';
        }
    }
}

// Initialize global logger
const CareerLogger = new CareerGuidanceLogger();

// Export for use in other modules
window.CareerLogger = CareerLogger;

// Legacy compatibility
window.Logger = CareerLogger;

// Auto-track page loads
document.addEventListener('DOMContentLoaded', () => {
    CareerLogger.trackPageView(window.location.pathname, document.title);
});

// Debug helper - show logs in console with Ctrl+Shift+L
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        CareerLogger.createLogViewer();
    }
});

console.log('Career Guidance Logger initialized successfully');
console.log('Press Ctrl+Shift+L to view debug logs');