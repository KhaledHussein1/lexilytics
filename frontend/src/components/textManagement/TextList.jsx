import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { deleteText, analyzeText } from "../../api/textService";
import { CircularProgress ,Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const MAX_PREVIEW_LENGTH = 100;

const TextList = ({texts, updateText, updateCallback }) => {
    const navigate = useNavigate();
    const [loadingState, setLoadingState] = useState({});

    const onDelete = async (id) => {
        try {
            await deleteText(id);
            updateCallback();
        } catch (error) {
            console.error("Error deleting text:", error);
        }
    };

    const onAnalyze = async (id) => {
        try {
            setLoadingState(prevState => ({ ...prevState, [id]: true })); // Set loading state for specific text to true
            const analysisData = await analyzeText(id);
            console.log("Analysis data:", analysisData);
            navigate('/analysis-results', { state: analysisData });
        } catch (error) {
            console.error("Error analyzing text:", error);
        } finally {
            setLoadingState(prevState => ({ ...prevState, [id]: false })); // Reset loading state for specific text
        }
    };

    const truncateText = (text) => {
        return text.length > MAX_PREVIEW_LENGTH ? text.substring(0, MAX_PREVIEW_LENGTH) + '...' : text;
    };

    return (
        <div>
        <h2>LexiLytics</h2>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Content</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {texts.map((text) => (
                        <TableRow key={text.id}>
                            <TableCell>{text.title}</TableCell>
                            <TableCell>{truncateText(text.text)}</TableCell>
                            <TableCell>
                                <Button onClick={() => onAnalyze(text.id)} variant="outlined" disabled={loadingState[text.id]}>
                                    {loadingState[text.id] ? <CircularProgress size={24} /> : "Analyze"}
                                </Button>
                                <Button onClick={() => updateText(text)} variant="outlined">Update</Button>
                                <Button onClick={() => onDelete(text.id)} variant="outlined">Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
    )
}

export default TextList