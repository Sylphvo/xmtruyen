import React, { useState } from 'react';
import { Box, Typography, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Slider, Alert } from '@mui/material';
import { Settings, Book } from 'lucide-react';
import { Print, PictureAsPdf } from '@mui/icons-material';

export default function PrintPipeline() {
    const [bookId, setBookId] = useState('');
    const [paperSize, setPaperSize] = useState('14x20');
    const [marginTop, setMarginTop] = useState(2);
    const [marginBottom, setMarginBottom] = useState(2);
    const [marginInner, setMarginInner] = useState(2.5);
    const [marginOuter, setMarginOuter] = useState(1.5);
    const [cmykEnabled, setCmykEnabled] = useState(true);
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleGeneratePdf = () => {
        if (!bookId) {
            alert('Vui lòng nhập ID Sách / Tên Sách');
            return;
        }

        setIsGenerating(true);
        setSuccessMsg('');

        // Simulate API call to backend print service (e.g. LaTeX / Puppeteer export)
        setTimeout(() => {
            setIsGenerating(false);
            setSuccessMsg(`Đã tạo thành công file PDF Sách Giấy cho "${bookId}" với hệ màu ${cmykEnabled ? 'CMYK' : 'RGB'}.`);
        }, 2000);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Print /> Dàn Trang & In Ấn Sách Giấy (Print Pipeline)
            </Typography>
            <Typography color="textSecondary" paragraph>
                Cấu hình lề, khổ giấy và xuất file PDF (chuẩn CMYK) gửi nhà in.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom><Book size={18}/> Thông tin Sách</Typography>
                        <TextField 
                            fullWidth 
                            label="ID Sách hoặc Tên Sách" 
                            variant="outlined" 
                            value={bookId}
                            onChange={(e) => setBookId(e.target.value)}
                            margin="normal"
                        />
                        
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Khổ giấy (Book Size)</InputLabel>
                            <Select 
                                value={paperSize} 
                                label="Khổ giấy (Book Size)"
                                onChange={(e) => setPaperSize(e.target.value)}
                            >
                                <MenuItem value="14x20">14 x 20 cm (Tiêu chuẩn truyện chữ)</MenuItem>
                                <MenuItem value="16x24">16 x 24 cm (Sách giáo khoa, chuyên ngành)</MenuItem>
                                <MenuItem value="13x19">13 x 19 cm (Light Novel)</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Hệ màu xuất bản</InputLabel>
                            <Select 
                                value={cmykEnabled ? "cmyk" : "rgb"} 
                                label="Hệ màu xuất bản"
                                onChange={(e) => setCmykEnabled(e.target.value === 'cmyk')}
                            >
                                <MenuItem value="cmyk">CMYK (Dành cho nhà in)</MenuItem>
                                <MenuItem value="rgb">RGB (Bản đọc Digital PDF)</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom><Settings size={18}/> Căn Lề (Margins - cm)</Typography>
                        
                        <Typography gutterBottom>Lề trên (Top): {marginTop} cm</Typography>
                        <Slider value={marginTop} onChange={(_, val) => setMarginTop(val as number)} min={0.5} max={5} step={0.1} />

                        <Typography gutterBottom>Lề dưới (Bottom): {marginBottom} cm</Typography>
                        <Slider value={marginBottom} onChange={(_, val) => setMarginBottom(val as number)} min={0.5} max={5} step={0.1} />

                        <Typography gutterBottom>Lề trong (Inner/Gutter - Gáy sách): {marginInner} cm</Typography>
                        <Slider value={marginInner} onChange={(_, val) => setMarginInner(val as number)} min={1} max={5} step={0.1} />

                        <Typography gutterBottom>Lề ngoài (Outer): {marginOuter} cm</Typography>
                        <Slider value={marginOuter} onChange={(_, val) => setMarginOuter(val as number)} min={0.5} max={5} step={0.1} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom>Preview & Xuất Bản</Typography>
                        
                        <Box 
                            sx={{ 
                                flex: 1, 
                                background: '#f5f5f5', 
                                border: '1px dashed #ccc',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                mb: 3,
                                minHeight: '300px'
                            }}
                        >
                            <PictureAsPdf size={48} color="#999" />
                            <Typography color="textSecondary" sx={{ mt: 2 }}>
                                Bản xem trước lề trang (Preview)
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {paperSize} | Lề: {marginTop} - {marginBottom} - {marginInner} - {marginOuter}
                            </Typography>
                        </Box>

                        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large" 
                            startIcon={<Print />}
                            onClick={handleGeneratePdf}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Đang tạo bản In PDF...' : 'Xuất File Print-Ready PDF'}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
