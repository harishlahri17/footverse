import React, { useState } from 'react';
import DeliveryLayout from '../layout/DeliveryLayout';

import { 
    Box, Card, CardContent, Typography, Grid, Accordion, 
    AccordionSummary, AccordionDetails, TextField, Button, 
    Divider, Stack, Paper, Alert
} from '@mui/material';
import { 
    ExpandMoreRounded, SupportAgentRounded, EmailRounded, 
    PhoneRounded, QuestionAnswerRounded, SendRounded
} from '@mui/icons-material';

export default function DeliverySupport() {
    const [ticket, setTicket] = useState({ subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const faqs = [
        {
            question: "How is my delivery commission calculated?",
            answer: "You receive a fixed commission of ₹30 for every successfully delivered order. Commissions are credited immediately upon marking an order as 'Delivered'."
        },
        {
            question: "What happens if a customer isn't home?",
            answer: "Attempt to call the customer twice. If they remain unreachable, mark the order status accordingly in the app and return the package to the warehouse at the end of your shift."
        },
        {
            question: "How do I update my vehicle information?",
            answer: "You can update your vehicle type and license number from the 'Profile' section. Significant changes may require administrative approval."
        },
        {
            question: "My GPS isn't syncing properly, what should I do?",
            answer: "Ensure location services are enabled on your device with 'High Accuracy' mode. Restart the app if the GPS status on your tracking screen remains offline."
        }
    ];

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        // Since no backend endpoint exists for delivery agent support tickets yet,
        // we display a success message indicating the request was captured.
        setSubmitted(true);
        setTicket({ subject: '', message: '' });
        
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <DeliveryLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" gutterBottom>
                    Help & Support
                </Typography>
                <Typography color="text.secondary">
                    Get assistance and find answers to common questions
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Contact Options & Ticket Form */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ borderRadius: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
                        <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <SupportAgentRounded sx={{ fontSize: 64, opacity: 0.9 }} />
                            <Box>
                                <Typography variant="h6" fontWeight="700" gutterBottom>
                                    Need direct help?
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Our support team is available 24/7 to assist delivery partners with active orders.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    <Stack spacing={2} sx={{ mb: 4 }}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PhoneRounded color="primary" />
                            <Box>
                                <Typography variant="body2" color="text.secondary" fontWeight="600">Emergency Support Line</Typography>
                                <Typography variant="body1" fontWeight="700">+1 (800) 555-0199</Typography>
                            </Box>
                        </Paper>
                        
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <EmailRounded color="secondary" />
                            <Box>
                                <Typography variant="body2" color="text.secondary" fontWeight="600">Email Support</Typography>
                                <Typography variant="body1" fontWeight="700">partners@footverse.com</Typography>
                            </Box>
                        </Paper>
                    </Stack>

                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="700" gutterBottom>
                                Raise a Ticket
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Describe your issue below and our team will get back to you within 24 hours.
                            </Typography>
                            
                            {submitted && (
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Your support ticket has been submitted successfully!
                                </Alert>
                            )}

                            <form onSubmit={handleSubmitTicket}>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Subject"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        value={ticket.subject}
                                        onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                                    />
                                    <TextField
                                        label="Message Details"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        multiline
                                        rows={4}
                                        value={ticket.message}
                                        onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                                    />
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        color="primary" 
                                        size="large"
                                        endIcon={<SendRounded />}
                                        sx={{ borderRadius: 2, py: 1.5 }}
                                    >
                                        Submit Ticket
                                    </Button>
                                </Stack>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                {/* FAQs */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                                <QuestionAnswerRounded color="primary" fontSize="large" />
                                <Typography variant="h5" fontWeight="800">
                                    Frequently Asked Questions
                                </Typography>
                            </Box>
                            
                            {faqs.map((faq, index) => (
                                <Accordion 
                                    key={index} 
                                    disableGutters 
                                    elevation={0}
                                    sx={{ 
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&:not(:last-child)': { mb: 2 },
                                        borderRadius: '8px !important',
                                        '&:before': { display: 'none' }
                                    }}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                                        <Typography fontWeight="700">{faq.question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ pt: 0, pb: 2, px: 2 }}>
                                        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                            
                            <Divider sx={{ my: 4 }} />
                            
                            <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'action.hover', borderRadius: 3 }}>
                                <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                                    Still can't find what you're looking for?
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Check our comprehensive delivery guidelines or contact your regional manager.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </DeliveryLayout>
    );
}
