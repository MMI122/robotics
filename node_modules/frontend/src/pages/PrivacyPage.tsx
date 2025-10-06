import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  Link,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Storage as StorageIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  ContactSupport as ContactIcon,
  Cookie as CookieIcon,
  Shield as ShieldIcon,
  Language as LanguageIcon,
  Email as EmailIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PrivacyHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(6, 0),
  marginBottom: theme.spacing(4),
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `0 0 ${theme.spacing(2)}px 0`,
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  border: `1px solid ${theme.palette.divider}`,
}));

interface PrivacySection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
  subsections?: {
    title: string;
    content: string[];
  }[];
  important?: boolean;
}

interface DataType {
  type: string;
  purpose: string;
  retention: string;
  sharing: string;
}

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const PrivacyPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState<string | false>('overview');
  const [dataRequestDialogOpen, setDataRequestDialogOpen] = useState(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    necessary: true,
    analytics: true,
    marketing: false,
    preferences: true
  });

  const lastUpdated = '2024-01-15';
  const effectiveDate = '2024-01-01';

  const dataTypes: DataType[] = [
    {
      type: 'Personal Information',
      purpose: 'Account creation, order processing, customer service',
      retention: '5 years after last activity',
      sharing: 'Never shared without consent'
    },
    {
      type: 'Payment Information',
      purpose: 'Processing transactions, fraud prevention',
      retention: 'As required by law (typically 7 years)',
      sharing: 'Only with payment processors'
    },
    {
      type: 'Usage Data',
      purpose: 'Site improvement, analytics, personalization',
      retention: '2 years',
      sharing: 'Aggregated data only'
    },
    {
      type: 'Device Information',
      purpose: 'Technical support, security, optimization',
      retention: '1 year',
      sharing: 'Never shared'
    },
    {
      type: 'Communication Data',
      purpose: 'Customer support, order updates, marketing',
      retention: '3 years',
      sharing: 'Only with service providers'
    }
  ];

  const privacyData: PrivacySection[] = [
    {
      id: 'overview',
      title: 'Privacy Overview',
      icon: <SecurityIcon />,
      important: true,
      content: [
        'At RoboticsShop, we take your privacy seriously and are committed to protecting your personal information.',
        'This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.',
        'We comply with all applicable privacy laws including GDPR, CCPA, and other regional privacy regulations.',
        'By using our service, you consent to the data practices described in this policy.',
        'We will never sell your personal information to third parties for their marketing purposes.'
      ]
    },
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: <StorageIcon />,
      content: [
        'We collect information you provide directly to us, such as when you create an account or make a purchase.',
        'We automatically collect certain information when you use our services, including usage data and device information.',
        'We may collect information from third parties, such as social media platforms or payment processors.',
        'We use cookies and similar technologies to enhance your experience and gather usage data.',
        'All data collection is done in accordance with applicable privacy laws and regulations.'
      ],
      subsections: [
        {
          title: 'Personal Information',
          content: [
            'Name, email address, phone number',
            'Billing and shipping addresses',
            'Payment information (processed securely)',
            'Account preferences and settings',
            'Communication history with customer service'
          ]
        },
        {
          title: 'Automatic Information',
          content: [
            'IP address and location data',
            'Browser type and version',
            'Operating system and device information',
            'Pages visited and time spent on site',
            'Referring websites and search terms'
          ]
        },
        {
          title: 'Cookies and Tracking',
          content: [
            'Essential cookies for site functionality',
            'Analytics cookies to understand usage patterns',
            'Marketing cookies for personalized advertising',
            'Preference cookies to remember your settings'
          ]
        }
      ]
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: <VisibilityIcon />,
      content: [
        'We use your information to provide, maintain, and improve our services.',
        'To process transactions and send you related information including confirmations and receipts.',
        'To send you technical notices, updates, security alerts, and administrative messages.',
        'To respond to your comments, questions, and provide customer service.',
        'To communicate with you about products, services, offers, and events.'
      ],
      subsections: [
        {
          title: 'Service Provision',
          content: [
            'Processing and fulfilling your orders',
            'Managing your account and preferences',
            'Providing customer support',
            'Sending order and shipping notifications'
          ]
        },
        {
          title: 'Improvement and Analytics',
          content: [
            'Analyzing usage patterns to improve our website',
            'Conducting research and development',
            'Testing new features and functionality',
            'Monitoring site performance and security'
          ]
        },
        {
          title: 'Marketing and Communication',
          content: [
            'Sending promotional emails (with your consent)',
            'Personalizing your shopping experience',
            'Displaying relevant advertisements',
            'Conducting surveys and collecting feedback'
          ]
        }
      ]
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: <ShareIcon />,
      important: true,
      content: [
        'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.',
        'We may share information with trusted service providers who assist us in operating our website.',
        'We may disclose information when required by law or to protect our rights and safety.',
        'In the event of a merger or acquisition, your information may be transferred to the new entity.',
        'We may share aggregated, non-personally identifiable information for research or marketing purposes.'
      ],
      subsections: [
        {
          title: 'Service Providers',
          content: [
            'Payment processors for transaction handling',
            'Shipping companies for order fulfillment',
            'Email service providers for communications',
            'Analytics providers for site improvement',
            'Customer service platforms for support'
          ]
        },
        {
          title: 'Legal Requirements',
          content: [
            'Compliance with applicable laws and regulations',
            'Response to legal process or government requests',
            'Protection of our rights, property, or safety',
            'Investigation of fraud or security issues'
          ]
        }
      ]
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: <ShieldIcon />,
      important: true,
      content: [
        'We implement appropriate technical and organizational measures to protect your information.',
        'All sensitive data is encrypted in transit and at rest using industry-standard encryption.',
        'We regularly review and update our security practices to address new threats.',
        'Access to personal information is restricted to authorized personnel only.',
        'We conduct regular security audits and vulnerability assessments.'
      ],
      subsections: [
        {
          title: 'Technical Safeguards',
          content: [
            'SSL/TLS encryption for all data transmission',
            'Secure data storage with encryption at rest',
            'Regular security updates and patches',
            'Intrusion detection and prevention systems',
            'Secure backup and disaster recovery procedures'
          ]
        },
        {
          title: 'Administrative Safeguards',
          content: [
            'Employee training on data protection',
            'Access controls and authentication requirements',
            'Regular security awareness programs',
            'Incident response and breach notification procedures',
            'Third-party security assessments'
          ]
        }
      ]
    },
    {
      id: 'rights',
      title: 'Your Privacy Rights',
      icon: <PersonIcon />,
      important: true,
      content: [
        'You have the right to access, correct, or delete your personal information.',
        'You can opt out of marketing communications at any time.',
        'You have the right to data portability and can request a copy of your data.',
        'You can restrict or object to certain processing of your information.',
        'You have the right to lodge a complaint with a supervisory authority.'
      ],
      subsections: [
        {
          title: 'Access and Control',
          content: [
            'View and update your account information',
            'Download a copy of your personal data',
            'Request correction of inaccurate information',
            'Delete your account and associated data'
          ]
        },
        {
          title: 'Communication Preferences',
          content: [
            'Unsubscribe from marketing emails',
            'Opt out of SMS notifications',
            'Manage cookie preferences',
            'Control personalization settings'
          ]
        }
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: <CookieIcon />,
      content: [
        'We use cookies and similar technologies to enhance your browsing experience.',
        'Cookies help us remember your preferences and provide personalized content.',
        'You can control cookie settings through your browser or our cookie preference center.',
        'Some cookies are essential for the website to function properly.',
        'We respect your choices regarding non-essential cookies.'
      ]
    },
    {
      id: 'international',
      title: 'International Transfers',
      icon: <LanguageIcon />,
      content: [
        'Your information may be transferred to and processed in countries other than your own.',
        'We ensure appropriate safeguards are in place for international data transfers.',
        'We comply with applicable cross-border data transfer regulations.',
        'Standard contractual clauses or adequacy decisions govern international transfers.',
        'You have the right to obtain information about international transfers.'
      ]
    },
    {
      id: 'children',
      title: 'Children\'s Privacy',
      icon: <PersonIcon />,
      content: [
        'Our services are not directed to children under the age of 13.',
        'We do not knowingly collect personal information from children under 13.',
        'If we learn we have collected information from a child under 13, we will delete it promptly.',
        'Parents can contact us to review, modify, or delete their child\'s information.',
        'We encourage parents to monitor their children\'s online activities.'
      ]
    },
    {
      id: 'updates',
      title: 'Policy Updates',
      icon: <SettingsIcon />,
      content: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices.',
        'We will notify you of significant changes by email or through our website.',
        'The updated policy will be effective immediately upon posting.',
        'Your continued use of our services constitutes acceptance of the updated policy.',
        'We encourage you to review this policy periodically.'
      ]
    }
  ];

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCookieSettingChange = (setting: keyof CookieSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCookieSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const handleDataRequest = (requestType: string) => {
    // In a real app, this would submit a data request
    alert(`${requestType} request submitted. You will receive a confirmation email shortly.`);
    setDataRequestDialogOpen(false);
  };

  return (
    <Box>
      {/* Header */}
      <PrivacyHeader>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Breadcrumbs sx={{ color: 'white', mb: 3 }}>
              <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
                Home
              </Link>
              <Typography color="inherit">Privacy Policy</Typography>
            </Breadcrumbs>
            
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              <SecurityIcon sx={{ mr: 2, fontSize: 'inherit', verticalAlign: 'middle' }} />
              Privacy Policy
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
              Your privacy matters to us. Learn how we protect and use your information.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip 
                label={`Last Updated: ${lastUpdated}`} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip 
                label={`Effective: ${effectiveDate}`} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Button
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                startIcon={<PersonIcon />}
                onClick={() => setDataRequestDialogOpen(true)}
              >
                Manage My Data
              </Button>
            </Box>
          </motion.div>
        </Container>
      </PrivacyHeader>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Privacy Summary */}
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Privacy at a Glance
            </Typography>
            <Typography variant="body2">
              We collect only the information necessary to provide our services, use industry-standard security measures 
              to protect your data, and give you control over your personal information. We never sell your data to third parties.
            </Typography>
          </Alert>

          {/* Data Types Table */}
          <SectionCard sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Types of Data We Collect
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Data Type</strong></TableCell>
                    <TableCell><strong>Purpose</strong></TableCell>
                    <TableCell><strong>Retention</strong></TableCell>
                    <TableCell><strong>Sharing</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTypes.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.purpose}</TableCell>
                      <TableCell>{row.retention}</TableCell>
                      <TableCell>{row.sharing}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SectionCard>

          {/* Cookie Settings */}
          <SectionCard sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              <CookieIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Cookie Preferences
            </Typography>
            <Typography variant="body2" paragraph>
              Manage your cookie preferences. Essential cookies cannot be disabled as they are required for the website to function.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={cookieSettings.necessary}
                    disabled
                  />
                }
                label="Necessary Cookies (Required)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={cookieSettings.analytics}
                    onChange={handleCookieSettingChange('analytics')}
                  />
                }
                label="Analytics Cookies"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={cookieSettings.marketing}
                    onChange={handleCookieSettingChange('marketing')}
                  />
                }
                label="Marketing Cookies"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={cookieSettings.preferences}
                    onChange={handleCookieSettingChange('preferences')}
                  />
                }
                label="Preference Cookies"
              />
            </Box>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Save Cookie Preferences
            </Button>
          </SectionCard>

          {/* Privacy Sections */}
          {privacyData.map((section) => (
            <StyledAccordion
              key={section.id}
              expanded={expanded === section.id}
              onChange={handleChange(section.id)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: section.important ? 'error.main' : 'secondary.main' }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                  {section.important && (
                    <Chip label="Important" size="small" color="error" />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <List sx={{ mb: section.subsections ? 3 : 0 }}>
                    {section.content.map((item, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemText 
                          primary={item}
                          sx={{
                            '& .MuiListItemText-primary': {
                              lineHeight: 1.6,
                              color: 'text.primary'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {section.subsections && (
                    <Box>
                      {section.subsections.map((subsection, subIndex) => (
                        <Box key={subIndex} sx={{ mb: 3 }}>
                          <Divider sx={{ mb: 2 }} />
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'secondary.main' }}>
                            {subsection.title}
                          </Typography>
                          <List>
                            {subsection.content.map((item, itemIndex) => (
                              <ListItem key={itemIndex} sx={{ pl: 2 }}>
                                <ListItemText 
                                  primary={`• ${item}`}
                                  sx={{
                                    '& .MuiListItemText-primary': {
                                      lineHeight: 1.6,
                                      color: 'text.secondary'
                                    }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </StyledAccordion>
          ))}

          {/* Contact Information */}
          <SectionCard sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <ContactIcon color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Privacy Questions or Concerns?
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer:
            </Typography>
            <List>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText primary="Email: privacy@roboticsshop.com" />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText primary="Phone: 1-800-PRIVACY (1-800-774-8229)" />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText primary="Address: Privacy Officer, 123 Innovation Drive, Tech City, TC 12345" />
              </ListItem>
            </List>
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                startIcon={<ContactIcon />}
                onClick={() => navigate('/contact')}
                sx={{ mr: 2 }}
              >
                Contact Privacy Team
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/terms')}
              >
                Terms of Service
              </Button>
            </Box>
          </SectionCard>

          {/* Data Request Dialog */}
          <Dialog open={dataRequestDialogOpen} onClose={() => setDataRequestDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Manage Your Personal Data</DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                You have the right to access, correct, or delete your personal information. Choose an option below:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDataRequest('Data Download')}
                  fullWidth
                >
                  Download My Data
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate('/profile')}
                  fullWidth
                >
                  Update My Information
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDataRequest('Account Deletion')}
                  fullWidth
                  color="error"
                >
                  Delete My Account
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => handleDataRequest('Data Restriction')}
                  fullWidth
                >
                  Restrict Data Processing
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDataRequestDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PrivacyPage;