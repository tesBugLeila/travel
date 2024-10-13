
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const ChangeMapView = ({ coords }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
};

// Компонент для выбора местоположения на карте
const LocationPicker = ({ setCoordinates }) => {
  useMapEvents({
    click(e) {
      setCoordinates([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const CreateTravel = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location: '',
    description: '',
    cost: '',
    heritageSites: '',
    placesToVisit: '',
    rating: '',
    images: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState([55.7558, 37.6173]); // Москва по умолчанию
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setForm({ ...form, images: Array.from(files) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Функция поиска местоположения
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.warn('Пожалуйста, введите название города, страны или достопримечательности для поиска.');
      return;
    }

    setSearchLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&addressdetails=1&limit=10`
      );
      const data = await res.json();

      if (data.length === 0) {
        toast.info('Ничего не найдено по вашему запросу.');
        setSearchResults([]);
      } else {
        setSearchResults(data);
        toast.success(`Найдено ${data.length} результатов.`);
      }
    } catch (err) {
      console.error('Ошибка при поиске местоположения:', err);
      toast.error('Не удалось выполнить поиск. Попробуйте снова позже.');
    } finally {
      setSearchLoading(false);
    }
  };

 
  const handleSelectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setCoordinates([lat, lon]);
    setForm({ ...form, location: result.display_name });
    setSearchResults([]); 
    toast.success(`Выбрано: ${result.display_name}`);
  };


  const validateForm = () => {
    const { location } = form;
    if (!location.trim()) {
      setError('Местоположение обязательно для заполнения.');
      return false;
    }
  
    setError('');
    return true;
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Пожалуйста, заполните обязательные поля.');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('location', form.location);
      data.append('description', form.description);
      data.append('cost', form.cost);
      data.append(
        'heritageSites',
        form.heritageSites
          ? form.heritageSites.split(',').map((site) => site.trim())
          : []
      );
      data.append(
        'placesToVisit',
        form.placesToVisit
          ? form.placesToVisit.split(',').map((place) => place.trim())
          : []
      );
      data.append('rating', form.rating);
      data.append('latitude', coordinates[0]);
      data.append('longitude', coordinates[1]);

      
      form.images.forEach((image) => {
        data.append('images', image);
      });

      await api.post('/travel', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Путешествие успешно создано!');
      navigate('/travels/mine'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании записи');
      toast.error(err.response?.data?.message || 'Ошибка при создании записи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Создать Запись о Путешествии
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="Местоположение"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Описание"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Стоимость (₽)"
            name="cost"
            type="number"
            value={form.cost}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Места культурного наследия (через запятую)"
            name="heritageSites"
            value={form.heritageSites}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Места для посещения (через запятую)"
            name="placesToVisit"
            value={form.placesToVisit}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Оценка (1-5)"
            name="rating"
            type="number"
            inputProps={{ min: 1, max: 5, step: 0.1 }}
            value={form.rating}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Box mt={3} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <TextField
                  label="Поиск по городу, стране или достопримечательности"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  fullWidth
                  disabled={searchLoading}
                >
                  {searchLoading ? <CircularProgress size={24} /> : 'Поиск'}
                </Button>
              </Grid>
            </Grid>
          </Box>

  
          {searchResults.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Результаты поиска:</Typography>
              <List>
                {searchResults.map((result) => (
                  <ListItem key={result.place_id} disablePadding>
                    <ListItemButton onClick={() => handleSelectSearchResult(result)}>
                      <ListItemText primary={result.display_name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

       
          <Box mt={2}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-images"
              multiple
              type="file"
              name="images"
              onChange={handleChange}
            />
            <label htmlFor="upload-images">
              <Button variant="contained" color="primary" component="span" fullWidth>
                Выберите изображения
              </Button>
            </label>
          </Box>

        
          {form.images.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Предварительный просмотр:</Typography>
              <Grid container spacing={2}>
                {form.images.map((file, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Изображение ${index + 1}`}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

    
          <Box mt={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Создать'}
            </Button>
          </Box>
        </form>
      </Box>


      <Box mt={5}>
        <Typography variant="subtitle1" gutterBottom>
          Выберите местоположение на карте:
        </Typography>
        <MapContainer center={coordinates} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ChangeMapView coords={coordinates} />
          <Marker position={coordinates} icon={markerIcon}>
            <Popup>{form.location || 'Выберите местоположение'}</Popup>
          </Marker>
          <LocationPicker setCoordinates={setCoordinates} />
        </MapContainer>
        <Box mt={2}>
          <Typography variant="subtitle1">
            Текущие координаты: {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateTravel;


