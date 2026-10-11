const fs = require('fs');
const path = require('path');

const uploadsRoot = path.resolve(
    process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads')
);
const categories = new Set(['course-videos', 'profile-pictures', 'resumes']);

const getUploadDirectory = (category) => {
    if (!categories.has(category)) {
        throw new Error(`Unsupported upload category: ${category}`);
    }

    const directory = path.join(uploadsRoot, category);
    fs.mkdirSync(directory, { recursive: true });
    return directory;
};

const getUploadPath = (category, filename) => {
    const safeFilename = path.basename(String(filename).replace(/\\/g, '/'));
    return path.join(getUploadDirectory(category), safeFilename);
};

module.exports = { getUploadDirectory, getUploadPath };