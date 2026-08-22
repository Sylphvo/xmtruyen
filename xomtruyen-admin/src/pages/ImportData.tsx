import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert } from '@mui/material';
import { UploadFile, CheckCircle, Warning } from '@mui/icons-material';

interface ImportJob {
    id: string;
    name: string;
    sourceType: string;
    status: string;
    totalRows: number;
    processedRows: number;
    failedRows: number;
    createdAt: string;
}

const ImportData: React.FC = () => {
    const [jobs, setJobs] = useState<ImportJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mock fetching jobs (in real app, use axios)
    const fetchJobs = async () => {
        setLoading(true);
        try {
            // Placeholder: await axios.get('/api/admin/import/jobs')
            setJobs([
                { id: '1', name: 'Import Books 2026', sourceType: 'CSV', status: 'Pending', totalRows: 0, processedRows: 0, failedRows: 0, createdAt: new Date().toISOString() }
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setError(null);
        try {
            // Placeholder: await axios.post('/api/admin/import/jobs') to create job
            // Then upload CSV to /api/admin/import/jobs/{jobId}/upload-csv
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
            setSelectedFile(null);
            fetchJobs(); // refresh list
        } catch (err) {
            setError('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const [pasteText, setPasteText] = useState('');
    const [ocrImageUrl, setOcrImageUrl] = useState('');

    const handlePasteUpload = async () => {
        if (!pasteText) return;
        setUploading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API
            setPasteText('');
            fetchJobs();
        } catch (err) {
            setError('Paste upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleOcrUpload = async () => {
        if (!ocrImageUrl) return;
        setUploading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API
            setOcrImageUrl('');
            fetchJobs();
        } catch (err) {
            setError('OCR failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Import Data
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Paper sx={{ p: 3, flex: 1 }}>
                    <Typography variant="h6" gutterBottom>Upload File (CSV, JSON)</Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button variant="outlined" component="label" startIcon={<UploadFile />}>
                            Select File
                            <input type="file" hidden accept=".csv,.json" onChange={handleFileSelect} />
                        </Button>
                        <Typography>{selectedFile?.name || 'No file selected'}</Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            disabled={!selectedFile || uploading}
                            onClick={handleUpload}
                        >
                            {uploading ? <CircularProgress size={24} /> : 'Upload & Preview'}
                        </Button>
                    </Box>
                </Paper>

                <Paper sx={{ p: 3, flex: 1 }}>
                    <Typography variant="h6" gutterBottom>Paste Content</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <textarea 
                            rows={3} 
                            placeholder="Paste Excel data here (tab-separated)..."
                            value={pasteText}
                            onChange={(e) => setPasteText(e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                        />
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            disabled={!pasteText || uploading}
                            onClick={handlePasteUpload}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            {uploading ? <CircularProgress size={24} /> : 'Parse Text'}
                        </Button>
                    </Box>
                </Paper>

                <Paper sx={{ p: 3, flex: 1 }}>
                    <Typography variant="h6" gutterBottom>Image OCR</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <input 
                            type="text" 
                            placeholder="Image URL..."
                            value={ocrImageUrl}
                            onChange={(e) => setOcrImageUrl(e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                        />
                        <Button 
                            variant="contained" 
                            color="info" 
                            disabled={!ocrImageUrl || uploading}
                            onClick={handleOcrUpload}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            {uploading ? <CircularProgress size={24} /> : 'Run OCR'}
                        </Button>
                    </Box>
                </Paper>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Recent Import Jobs</Typography>
                {loading ? <CircularProgress /> : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Job Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Rows (Total/Processed/Failed)</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jobs.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell>{job.name}</TableCell>
                                        <TableCell><Chip label={job.sourceType} size="small" /></TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={job.status} 
                                                color={job.status === 'Confirmed' ? 'success' : job.status === 'Preview' ? 'warning' : 'default'}
                                                icon={job.status === 'Confirmed' ? <CheckCircle /> : undefined}
                                                size="small" 
                                            />
                                        </TableCell>
                                        <TableCell>{job.totalRows} / {job.processedRows} / {job.failedRows}</TableCell>
                                        <TableCell>{new Date(job.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            {job.status === 'Preview' && (
                                                <Button size="small" variant="contained" color="success">Confirm Import</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );
};

export default ImportData;
