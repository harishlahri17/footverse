import React, { useState } from 'react';
import { 
  Box, Container, Grid, Typography, InputBase, 
  Card, CardContent, Accordion, AccordionSummary, AccordionDetails,
  useTheme, Paper
} from '@mui/material';
import { 
  Search, ExpandMore, LocalShippingOutlined, 
  PaymentOutlined, AssignmentReturnOutlined, PersonOutlined,
  Inventory2Outlined, ReceiptLongOutlined, HelpOutlineOutlined
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import Breadcrumb from '../../components/common/Breadcrumb';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 30,
  backgroundColor: 'white',
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  margin: '0 auto',
  width: '100%',
  maxWidth: 600,
  padding: theme.spacing(1, 2)
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 5),
    fontSize: '1.1rem'
  },
}));

export default function HelpCenter() {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { id: 'orders', label: 'Orders', icon: <ReceiptLongOutlined /> },
    { id: 'payments', label: 'Payments', icon: <PaymentOutlined /> },
    { id: 'shipping', label: 'Shipping', icon: <LocalShippingOutlined /> },
    { id: 'returns', label: 'Returns & Refunds', icon: <AssignmentReturnOutlined /> },
    { id: 'account', label: 'Account', icon: <PersonOutlined /> },
    { id: 'products', label: 'Products', icon: <Inventory2Outlined /> },
  ];

  const faqs = [
    {
      category: 'orders',
      question: "How do I track my order?",
      answer: "Once your order has shipped, you will receive an email containing your tracking number. You can also view tracking information in your Account Dashboard under 'My Orders'."
    },
    {
      category: 'orders',
      question: "Can I change or cancel my order?",
      answer: "We process orders quickly, but if you need to cancel or modify your order, please contact our support team within 1 hour of placing the order."
    },
    {
      category: 'returns',
      question: "What is your return policy?",
      answer: "We offer a 30-day hassle-free return policy. Items must be unworn and in their original packaging. Simply go to your order history and click 'Initiate Return'."
    },
    {
      category: 'returns',
      question: "How long do refunds take?",
      answer: "Once we receive and inspect your returned item, your refund will be processed back to your original payment method within 5-7 business days."
    },
    {
      category: 'shipping',
      question: "Do you offer free shipping?",
      answer: "Yes, we offer free standard shipping on all orders over ₹2000. For orders below this amount, standard shipping is ₹150."
    },
    {
      category: 'shipping',
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within the country. We are working on expanding our delivery network globally."
    },
    {
      category: 'payments',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, Net Banking, and Cash on Delivery (COD) for eligible pincodes."
    }
  ];

  const filteredFaqs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory || (activeCategory === 'returns' && (faq.category === 'returns' || faq.category === 'refunds')));

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* Banner */}
      <Box sx={{ bgcolor: 'primary.900', color: 'white', pt: 8, pb: 12, position: 'relative' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" fontWeight={800} mb={2}>How can we help you?</Typography>
          <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.9, mb: 5 }}>
            Search our knowledge base or browse categories below to find your answer.
          </Typography>

          <SearchContainer>
            <Box sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 20, color: 'text.secondary', display: 'flex' }}>
              <Search fontSize="medium" />
            </Box>
            <StyledInputBase
              placeholder="E.g., How to return a product?"
              inputProps={{ 'aria-label': 'search help' }}
            />
          </SearchContainer>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
        {/* Categories */}
        <Grid container spacing={2} justifyContent="center" mb={8}>
          {categories.map((cat) => (
            <Grid item xs={6} sm={4} md={2} key={cat.id}>
              <Card 
                onClick={() => setActiveCategory(activeCategory === cat.id ? 'All' : cat.id)}
                sx={{ 
                  textAlign: 'center', p: 3, borderRadius: 4, cursor: 'pointer',
                  bgcolor: activeCategory === cat.id ? 'primary.main' : 'white',
                  color: activeCategory === cat.id ? 'white' : 'text.primary',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}
              >
                <Box sx={{ color: activeCategory === cat.id ? 'white' : 'primary.main', mb: 1 }}>
                  {React.cloneElement(cat.icon, { fontSize: 'large' })}
                </Box>
                <Typography variant="subtitle2" fontWeight={700}>{cat.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={6}>
          {/* FAQ Accordion */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <HelpOutlineOutlined color="primary" fontSize="large" />
              <Typography variant="h4" fontWeight={800}>Frequently Asked Questions</Typography>
            </Box>

            {filteredFaqs.length === 0 ? (
              <Typography color="text.secondary">No FAQs found for this category.</Typography>
            ) : (
              <Box>
                {filteredFaqs.map((faq, index) => (
                  <Accordion key={index} elevation={0} sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' }, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: 'grey.50', p: 2 }}>
                      <Typography variant="subtitle1" fontWeight={700}>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
                      <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Grid>

          {/* Side Help Cards */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight={800} mb={4}>Detailed Guides</Typography>
            
            <Card sx={{ p: 3, borderRadius: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderLeft: '4px solid', borderColor: 'primary.main' }}>
              <Typography variant="h6" fontWeight={800} mb={1}>Shipping & Delivery Guide</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Learn everything about our delivery partners, tracking systems, timelines, and shipping rates for different regions.
              </Typography>
              <Typography variant="subtitle2" color="primary.main" sx={{ cursor: 'pointer', fontWeight: 700 }}>Read Full Guide &rarr;</Typography>
            </Card>

            <Card sx={{ p: 3, borderRadius: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderLeft: '4px solid', borderColor: 'secondary.main' }}>
              <Typography variant="h6" fontWeight={800} mb={1}>Returns & Refunds Policy</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                A comprehensive step-by-step guide on how to pack, ship, and track your returned items, plus refund processing times.
              </Typography>
              <Typography variant="subtitle2" color="secondary.main" sx={{ cursor: 'pointer', fontWeight: 700 }}>Read Full Guide &rarr;</Typography>
            </Card>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'grey.100', textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={800} mb={1}>Still need help?</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                If you couldn't find the answer to your question, our support team is available 24/7.
              </Typography>
              <Button href="/contact" variant="contained" size="large" sx={{ borderRadius: 8 }}>
                Contact Support
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
