import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Chip,
  Paper,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Badge,
  CardMedia,
  ImageList,
  ImageListItem
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Verified as VerifiedIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
  },
}));

const RatingOverview = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3)
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reviews-tabpanel-${index}`}
      aria-labelledby={`reviews-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface Review {
  id: string;
  productId: string;
  product: Product;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  helpful: number;
  notHelpful: number;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt?: string;
  replies?: ReviewReply[];
}

interface ReviewReply {
  id: string;
  content: string;
  isVendor: boolean;
  vendorName?: string;
  createdAt: string;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

const CustomerReviews: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviewImages, setReviewImages] = useState<File[]>([]);

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const watchedRating = watch('rating', 0);

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 'prod1',
        name: 'Arduino Uno R3 Microcontroller',
        image: '/api/placeholder/300/200',
        price: 29.99
      },
      {
        id: 'prod2',
        name: 'Servo Motor SG90',
        image: '/api/placeholder/300/200',
        price: 12.99
      }
    ];

    const mockReviews: Review[] = [
      {
        id: 'rev1',
        productId: 'prod1',
        product: mockProducts[0],
        userId: 'user1',
        userName: 'Alex Johnson',
        userAvatar: '/api/placeholder/40/40',
        rating: 5,
        title: 'Excellent Arduino board for beginners',
        content: 'This Arduino Uno is perfect for learning robotics. The build quality is great and it works exactly as expected. Highly recommended for anyone starting with Arduino projects.',
        images: ['/api/placeholder/200/150', '/api/placeholder/200/150'],
        helpful: 23,
        notHelpful: 2,
        isVerifiedPurchase: true,
        createdAt: '2024-01-15T10:30:00Z',
        replies: [
          {
            id: 'reply1',
            content: 'Thank you for your review! We\'re glad you\'re enjoying your Arduino Uno.',
            isVendor: true,
            vendorName: 'RoboticsShop Team',
            createdAt: '2024-01-16T09:15:00Z'
          }
        ]
      },
      {
        id: 'rev2',
        productId: 'prod2',
        product: mockProducts[1],
        userId: 'user2',
        userName: 'Maria Garcia',
        userAvatar: '/api/placeholder/40/40',
        rating: 4,
        title: 'Good servo motor with minor issues',
        content: 'The servo motor works well for most applications. However, it can be a bit noisy under load. Overall satisfied with the purchase.',
        images: [],
        helpful: 15,
        notHelpful: 3,
        isVerifiedPurchase: true,
        createdAt: '2024-01-12T14:22:00Z'
      },
      {
        id: 'rev3',
        productId: 'prod1',
        product: mockProducts[0],
        userId: 'user3',
        userName: 'David Chen',
        rating: 5,
        title: 'Amazing quality and fast shipping',
        content: 'Ordered this for my robotics project and it arrived quickly. The quality is outstanding and it\'s been working perfectly for weeks now.',
        images: ['/api/placeholder/200/150'],
        helpful: 18,
        notHelpful: 1,
        isVerifiedPurchase: true,
        createdAt: '2024-01-10T11:45:00Z'
      }
    ];

    const mockMyReviews: Review[] = [
      {
        id: 'myrev1',
        productId: 'prod1',
        product: mockProducts[0],
        userId: 'currentUser',
        userName: 'John Doe',
        rating: 5,
        title: 'Great product for robotics projects',
        content: 'I\'ve been using this Arduino for several projects and it never disappoints. Excellent build quality.',
        images: [],
        helpful: 12,
        notHelpful: 0,
        isVerifiedPurchase: true,
        createdAt: '2024-01-08T16:30:00Z'
      }
    ];

    const mockStats: ReviewStats = {
      totalReviews: 156,
      averageRating: 4.3,
      ratingDistribution: {
        5: 89,
        4: 42,
        3: 18,
        2: 5,
        1: 2
      }
    };

    setReviews(mockReviews);
    setMyReviews(mockMyReviews);
    setStats(mockStats);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleWriteReview = async (data: any) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: `rev${Date.now()}`,
        productId: selectedProduct!.id,
        product: selectedProduct!,
        userId: 'currentUser',
        userName: 'John Doe',
        rating: data.rating,
        title: data.title,
        content: data.content,
        images: reviewImages.map((_, index) => `/api/placeholder/200/150?${index}`),
        helpful: 0,
        notHelpful: 0,
        isVerifiedPurchase: true,
        createdAt: new Date().toISOString()
      };
      
      setMyReviews(prev => [newReview, ...prev]);
      setWriteReviewOpen(false);
      setSelectedProduct(null);
      setReviewImages([]);
      reset();
      setLoading(false);
    }, 1500);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReviewImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const handleHelpful = (reviewId: string, isHelpful: boolean) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? {
            ...review,
            helpful: isHelpful ? review.helpful + 1 : review.helpful,
            notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful
          }
        : review
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === null || review.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const RatingBar = ({ rating, count, total }: { rating: number, count: number, total: number }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Typography variant="body2" sx={{ minWidth: 20, mr: 1 }}>
        {rating}
      </Typography>
      <StarIcon sx={{ fontSize: 16, mr: 1, color: 'warning.main' }} />
      <Box sx={{ flexGrow: 1, mx: 1 }}>
        <LinearProgress
          variant="determinate"
          value={(count / total) * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            },
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ minWidth: 30 }}>
        {count}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Product Reviews
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Read and share reviews about your purchases
          </Typography>
        </Box>

        {/* Overall Rating Overview */}
        {stats && (
          <RatingOverview>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.averageRating.toFixed(1)}
                  </Typography>
                  <Rating value={stats.averageRating} readOnly precision={0.1} size="large" />
                  <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                    Based on {stats.totalReviews} reviews
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                {[5, 4, 3, 2, 1].map(rating => (
                  <RatingBar
                    key={rating}
                    rating={rating}
                    count={stats.ratingDistribution[rating] || 0}
                    total={stats.totalReviews}
                  />
                ))}
              </Grid>
            </Grid>
          </RatingOverview>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontSize: '1rem'
              }
            }}
          >
            <Tab 
              icon={<CommentIcon />} 
              label={`All Reviews (${reviews.length})`}
            />
            <Tab 
              icon={<StarIcon />} 
              label={`My Reviews (${myReviews.length})`}
            />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* All Reviews */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="newest">Newest first</MenuItem>
                    <MenuItem value="oldest">Oldest first</MenuItem>
                    <MenuItem value="highest">Highest rating</MenuItem>
                    <MenuItem value="lowest">Lowest rating</MenuItem>
                    <MenuItem value="helpful">Most helpful</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Filter by rating</InputLabel>
                  <Select
                    value={filterRating || ''}
                    label="Filter by rating"
                    onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                  >
                    <MenuItem value="">All ratings</MenuItem>
                    <MenuItem value={5}>5 stars</MenuItem>
                    <MenuItem value={4}>4 stars</MenuItem>
                    <MenuItem value={3}>3 stars</MenuItem>
                    <MenuItem value={2}>2 stars</MenuItem>
                    <MenuItem value={1}>1 star</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setWriteReviewOpen(true)}
                >
                  Write Review
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Reviews List */}
          <Grid container spacing={3}>
            {sortedReviews.map((review) => (
              <Grid item xs={12} key={review.id}>
                <ReviewCard>
                  <CardContent>
                    {/* Product Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 60, height: 60, borderRadius: 1, mr: 2 }}
                        image={review.product.image}
                        alt={review.product.name}
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {review.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${review.product.price}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Review Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={review.userAvatar} sx={{ width: 40, height: 40, mr: 2 }}>
                          {review.userName[0]}
                        </Avatar>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {review.userName}
                            </Typography>
                            {review.isVerifiedPurchase && (
                              <Chip 
                                label="Verified Purchase" 
                                size="small" 
                                color="success" 
                                variant="outlined"
                                icon={<VerifiedIcon />}
                              />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {/* Rating and Title */}
                    <Box sx={{ mb: 2 }}>
                      <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {review.title}
                      </Typography>
                    </Box>

                    {/* Review Content */}
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {review.content}
                    </Typography>

                    {/* Review Images */}
                    {review.images.length > 0 && (
                      <ImageList sx={{ mb: 2 }} cols={3} rowHeight={100}>
                        {review.images.map((image, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={image}
                              alt={`Review image ${index + 1}`}
                              loading="lazy"
                              style={{ borderRadius: 8 }}
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    )}

                    {/* Review Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<ThumbUpIcon />}
                          onClick={() => handleHelpful(review.id, true)}
                        >
                          Helpful ({review.helpful})
                        </Button>
                        <Button
                          size="small"
                          startIcon={<ThumbDownIcon />}
                          onClick={() => handleHelpful(review.id, false)}
                        >
                          Not helpful ({review.notHelpful})
                        </Button>
                      </Box>
                      <Button size="small" startIcon={<ShareIcon />}>
                        Share
                      </Button>
                    </Box>

                    {/* Vendor Replies */}
                    {review.replies && review.replies.length > 0 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        {review.replies.map((reply) => (
                          <Box key={reply.id} sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mr: 1 }}>
                                {reply.vendorName}
                              </Typography>
                              <Chip label="Vendor" size="small" color="primary" />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                                {format(new Date(reply.createdAt), 'MMM dd, yyyy')}
                              </Typography>
                            </Box>
                            <Typography variant="body2">
                              {reply.content}
                            </Typography>
                          </Box>
                        ))}
                      </>
                    )}
                  </CardContent>
                </ReviewCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* My Reviews */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              My Reviews
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setWriteReviewOpen(true)}
            >
              Write New Review
            </Button>
          </Box>

          <Grid container spacing={3}>
            {myReviews.map((review) => (
              <Grid item xs={12} key={review.id}>
                <ReviewCard>
                  <CardContent>
                    {/* Product Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 60, height: 60, borderRadius: 1, mr: 2 }}
                        image={review.product.image}
                        alt={review.product.name}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {review.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reviewed on {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Rating and Title */}
                    <Box sx={{ mb: 2 }}>
                      <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {review.title}
                      </Typography>
                    </Box>

                    {/* Review Content */}
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {review.content}
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Chip 
                        label={`${review.helpful} found helpful`} 
                        size="small" 
                        variant="outlined"
                        icon={<ThumbUpIcon />}
                      />
                      {review.isVerifiedPurchase && (
                        <Chip 
                          label="Verified Purchase" 
                          size="small" 
                          color="success" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                </ReviewCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Write Review Dialog */}
        <Dialog open={writeReviewOpen} onClose={() => setWriteReviewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Write a Review</DialogTitle>
          <form onSubmit={handleSubmit(handleWriteReview)}>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Select Product to Review
                  </Typography>
                  {/* This would typically be a dropdown of purchased products */}
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedProduct({
                      id: 'prod1',
                      name: 'Arduino Uno R3 Microcontroller',
                      image: '/api/placeholder/300/200',
                      price: 29.99
                    })}
                    sx={{ mb: 2 }}
                  >
                    Arduino Uno R3 Microcontroller
                  </Button>
                </Grid>

                {selectedProduct && (
                  <>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 80, height: 80, borderRadius: 1, mr: 2 }}
                          image={selectedProduct.image}
                          alt={selectedProduct.name}
                        />
                        <Box>
                          <Typography variant="h6">{selectedProduct.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${selectedProduct.price}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography component="legend" gutterBottom>
                        Overall Rating *
                      </Typography>
                      <Controller
                        name="rating"
                        control={control}
                        rules={{ required: 'Rating is required', min: 1 }}
                        render={({ field }) => (
                          <Rating
                            {...field}
                            size="large"
                            onChange={(_, value) => field.onChange(value)}
                          />
                        )}
                      />
                      {errors.rating && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                          {errors.rating.message as string}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="title"
                        control={control}
                        rules={{ required: 'Title is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Review Title"
                            placeholder="Summarize your experience"
                            error={!!errors.title}
                            helperText={errors.title?.message as string}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="content"
                        control={control}
                        rules={{ required: 'Review content is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Your Review"
                            multiline
                            rows={4}
                            placeholder="Share your thoughts about this product..."
                            error={!!errors.content}
                            helperText={errors.content?.message as string}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Add Photos (Optional)
                        </Typography>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="review-images"
                          multiple
                          type="file"
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="review-images">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<PhotoCameraIcon />}
                          >
                            Upload Photos
                          </Button>
                        </label>
                      </Box>
                      
                      {reviewImages.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {reviewImages.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              onDelete={() => setReviewImages(prev => prev.filter((_, i) => i !== index))}
                            />
                          ))}
                        </Box>
                      )}
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setWriteReviewOpen(false)}>Cancel</Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading || !selectedProduct}
              >
                {loading ? 'Publishing...' : 'Publish Review'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default CustomerReviews;