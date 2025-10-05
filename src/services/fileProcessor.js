// File processing service for extracting text from various document formats
// Supports PDF, DOC, DOCX, and TXT files using browser-compatible libraries

/**
 * Extract text from uploaded file based on file type
 * @param {File} file - The uploaded file
 * @returns {Promise<{success: boolean, text?: string, error?: string}>}
 */
export const extractTextFromFile = async (file) => {
  try {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    // Handle different file types
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await extractTextFromTxt(file);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPdf(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await extractTextFromDocx(file);
    } else if (
      fileType === 'application/msword' ||
      fileName.endsWith('.doc')
    ) {
      return await extractTextFromDoc(file);
    } else {
      return {
        success: false,
        error: 'Unsupported file format. Please upload PDF, DOC, DOCX, or TXT files.'
      };
    }
  } catch (error) {
    console.error('File processing error:', error);
    return {
      success: false,
      error: 'Failed to process file. Please try again or paste text manually.'
    };
  }
};

/**
 * Extract text from TXT file
 */
const extractTextFromTxt = async (file) => {
  try {
    const text = await file.text();
    return { success: true, text };
  } catch (error) {
    return { success: false, error: 'Failed to read text file' };
  }
};

/**
 * Extract text from PDF file using PDF.js
 */
const extractTextFromPdf = async (file) => {
  try {
    // Dynamically import PDF.js
    const pdfjsLib = await import('pdfjs-dist/webpack');
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return { success: true, text: fullText.trim() };
  } catch (error) {
    console.error('PDF processing error:', error);
    return { 
      success: false, 
      error: 'Failed to extract text from PDF. Please try converting to TXT or pasting text manually.' 
    };
  }
};

/**
 * Extract text from DOCX file using mammoth.js
 */
const extractTextFromDocx = async (file) => {
  try {
    // Dynamically import mammoth
    const mammoth = await import('mammoth');
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return { success: true, text: result.value };
  } catch (error) {
    console.error('DOCX processing error:', error);
    return { 
      success: false, 
      error: 'Failed to extract text from DOCX. Please try converting to TXT or pasting text manually.' 
    };
  }
};

/**
 * Extract text from DOC file
 * Note: DOC files are more complex and may require server-side processing
 * For now, we'll provide a helpful error message
 */
const extractTextFromDoc = async (file) => {
  return {
    success: false,
    error: 'DOC files are not fully supported in the browser. Please convert to DOCX, PDF, or TXT format, or paste the text manually.'
  };
};

/**
 * Validate file before processing
 * @param {File} file - The file to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validateFile = (file) => {
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Please upload files smaller than 10MB.'
    };
  }
  
  // Check file type
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];
  
  const allowedExtensions = ['.txt', '.pdf', '.docx', '.doc'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  
  if (!allowedTypes.includes(file.type.toLowerCase()) && !hasValidExtension) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.'
    };
  }
  
  return { valid: true };
};

/**
 * Get file type display name
 * @param {File} file - The file
 * @returns {string} - Display name for the file type
 */
export const getFileTypeDisplay = (file) => {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf')) return 'PDF';
  if (fileName.endsWith('.docx')) return 'Word Document';
  if (fileName.endsWith('.doc')) return 'Word Document (Legacy)';
  if (fileName.endsWith('.txt')) return 'Text File';
  
  return 'Document';
};
