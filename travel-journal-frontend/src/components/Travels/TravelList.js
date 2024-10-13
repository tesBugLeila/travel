
import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const TravelList = ({ travels }) => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom mt={5} textAlign="center">
        Путешествия
      </Typography>
      <Grid container spacing={4}>
       
      {travels.map((travel) => (
  <Grid item key={travel._id} xs={12} sm={6} md={4}>
    <Card>
      {travel.images && travel.images.length > 0 && (
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:5000${travel.images[0]}`} 
          alt={travel.location}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {travel.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {travel.description.length > 100
            ? `${travel.description.substring(0, 100)}...`
            : travel.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Стоимость:</strong> {travel.cost} ₽
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Оценка:</strong> {travel.rating}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Автор:</strong> {travel.user.username}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/travels/${travel._id}`}>
          Подробнее
        </Button>
      </CardActions>
    </Card>
  </Grid>
))}







      </Grid>
    </Container>
  );
};

TravelList.propTypes = {
  travels: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      image: PropTypes.string,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default React.memo(TravelList);
