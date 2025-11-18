import * as fs from 'fs';
import * as path from 'path';
import { analyzeSecurityImage } from './security_service';

export interface SecurityAlert {
  id: number;
  title: string;
  time: string;
  severity: 'High' | 'Medium' | 'Low';
  image: string; // URL path to image
  status: 'pending' | 'confirmed' | 'dismissed';
}

const iconicImagesDir = path.resolve(__dirname, '../dataset/GroceryStoreDataset/sample_images/iconic');
const naturalImagesDir = path.resolve(__dirname, '../dataset/GroceryStoreDataset/sample_images/natural');
const iconicImageFiles = fs.readdirSync(iconicImagesDir);
const naturalImageFiles = fs.readdirSync(naturalImagesDir);
const allImageFiles = [...iconicImageFiles, ...naturalImageFiles];

let alerts: SecurityAlert[] = [];
let nextAlertId = 1;

const generateAlert = async () => {
  const randomImageFile = allImageFiles[Math.floor(Math.random() * allImageFiles.length)];
  let imagePath;
  if (iconicImageFiles.includes(randomImageFile)) {
    imagePath = path.join(iconicImagesDir, randomImageFile);
  } else {
    imagePath = path.join(naturalImagesDir, randomImageFile);
  }
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  const analysisResult = await analyzeSecurityImage(base64Image);

  // Simple logic to determine severity based on keywords in the analysis
  let severity: 'High' | 'Medium' | 'Low' = 'Low';
  if (analysisResult.includes('theft') || analysisResult.includes('suspicious')) {
    severity = 'High';
  } else if (analysisResult.includes('unusual') || analysisResult.includes('out of place')) {
    severity = 'Medium';
  }

  const newAlert: SecurityAlert = {
    id: nextAlertId++,
    title: analysisResult,
    time: new Date().toLocaleTimeString(),
    severity,
    image: `/images/${randomImageFile}`,
    status: 'pending',
  };

  alerts.unshift(newAlert); // Add to the beginning of the array
  if (alerts.length > 10) {
    alerts.pop(); // Keep the list of alerts to a reasonable size
  }
};

// Generate an alert every 15 seconds
setInterval(generateAlert, 15000);

export const getSecurityAlerts = (severityFilter?: 'High' | 'Medium' | 'Low', page: number = 1, limit: number = 10) => {
  let filteredAlerts = alerts.filter(alert => alert.status === 'pending');
  if (severityFilter) {
    filteredAlerts = filteredAlerts.filter(alert => alert.severity === severityFilter);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return filteredAlerts.slice(startIndex, endIndex);
};

export const confirmAlert = (id: number) => {
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.status = 'confirmed';
  }
};

export const dismissAlert = (id: number) => {
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.status = 'dismissed';
  }
};
