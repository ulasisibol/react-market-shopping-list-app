import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import Confetti from 'js-confetti';
import Fuse from 'fuse.js'; // Fuzzy search için kütüphane
import 'bootstrap/dist/css/bootstrap.min.css';

const Title = styled.h1`
  text-align: center;
  margin-top: 20px;
  color: #343a40;
  font-size: 2rem;
`;

const HR = styled.hr`
  padding-right: 10%;
  padding-left: 10%;
  height: 1px;
  color: black;
  border-radius: 1px;
  padding-bottom: 5px;
  padding-top: 5px;
`;


const StyledContainer = styled(Container)`
  width: 900px !important;
  margin-top: 40px;
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledFormGroup = styled(Form.Group)`
  margin-right: 5px;
  margin-left: 5px;
`;

const StyledForm = styled(Form)`
  margin-bottom: 20px;
  justify-content: center;
  display: flex;
  align-items: end;
`;

const StyledButton = styled(Button)`
  padding: 10px 12px;
  height: 100%;
  background-color: #343a40;
  color: white;
  border-radius: 8px;
  border: none;
  margin: 10px;
  &:hover {
    background-color: #0c1d2e;
  }
`;

const StyledTable = styled(Table)`
  margin-top: 20px;
  width: 100%;
  text-align: center;

  th {
    background-color: #343a40;
    color: white;
  }

  td {
    background-color: #ffffff;
  }
`;

const StyledAlert = styled(Alert)`
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
  border-radius: 8px;
  padding: 1rem;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
`;

const shops = [
  { id: 1, name: "Migros" },
  { id: 2, name: "BİM" },
  { id: 3, name: "Teknosa" },
];

const categories = [
  { id: 1, name: "Elektronik" },
  { id: 2, name: "Şarküteri" },
  { id: 3, name: "Oyuncak" },
  { id: 4, name: "Bakliyat" },
  { id: 5, name: "Fırın" },
];

const App = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  // Filter states
  const [filteredShopId, setFilteredShopId] = useState('');
  const [filteredCategoryId, setFilteredCategoryId] = useState('');
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [filteredName, setFilteredName] = useState('');

  const fuse = new Fuse(products, { keys: ['name'], threshold: 0.3 });

  // Filtered products
  const filteredProducts = products.filter(product => {
    // Shop filter
    if (filteredShopId && product.shop !== filteredShopId) return false;
    // Category filter
    if (filteredCategoryId && product.category !== filteredCategoryId) return false;
    // Status filter
    if (filteredStatus !== 'all') {
      const isBought = filteredStatus === 'bought';
      if (product.isBought !== isBought) return false;
    }
    // Fuzzy name search filter
    if (filteredName) {
      const results = fuse.search(filteredName);
      return results.some(result => result.item.id === product.id);
    }
    return true;
  });

  const handleAddProduct = () => {
    if (!productName || !selectedShop || !selectedCategory) return;

    const newProduct = {
      id: nanoid(),
      name: productName,
      shop: selectedShop,
      category: selectedCategory,
      isBought: false,
    };
    
    setProducts([...products, newProduct]);
    setProductName('');
    setSelectedShop('');
    setSelectedCategory('');
  };

  const jsConfetti = new Confetti();

  const handleToggleBought = (id) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, isBought: !product.isBought } : product
    );
  
    setProducts(updatedProducts);
    
    if (updatedProducts.every(product => product.isBought)) {
      setAlertVisible(true);
      jsConfetti.addConfetti();
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (

    <StyledContainer>
      <Title>Alışveriş Listesi Uygulaması</Title>
      <HR></HR>
{/* Add Product Form */}
      <StyledForm>
        <StyledFormGroup>
          <Form.Label>Ürün Adı</Form.Label>
          <Form.Control
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </StyledFormGroup>
        <StyledFormGroup>
          <Form.Label>Market</Form.Label>
          <Form.Control
            as="select"
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
          >
            <option value="">Seçin</option>
            {shops.map(shop => (
              <option key={shop.id} value={shop.name}>{shop.name}</option>
            ))}
          </Form.Control>
        </StyledFormGroup>
        <StyledFormGroup>
          <Form.Label>Kategori</Form.Label>
          <Form.Control
            as="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Seçin</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </Form.Control>
        </StyledFormGroup>
        <StyledButton onClick={handleAddProduct}>Ürün Ekle</StyledButton>
      </StyledForm>
      <HR></HR>

      {/* Filter Form */}
      <StyledForm>
        <StyledFormGroup>
          <Form.Label>Market</Form.Label>
          <Form.Control
            as="select"
            value={filteredShopId}
            onChange={(e) => setFilteredShopId(e.target.value)}
          >
            <option value="">Tümü</option>
            {shops.map(shop => (
              <option key={shop.id} value={shop.name}>{shop.name}</option>
            ))}
          </Form.Control>
        </StyledFormGroup>
        <StyledFormGroup>
          <Form.Label>Kategori</Form.Label>
          <Form.Control
            as="select"
            value={filteredCategoryId}
            onChange={(e) => setFilteredCategoryId(e.target.value)}
          >
            <option value="">Tümü</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </Form.Control>
        </StyledFormGroup>
        <StyledFormGroup>
          <Form.Label>Satın Alma Durumu</Form.Label>
          <Form.Check
            type="radio"
            label="Tümü"
            name="status"
            value="all"
            checked={filteredStatus === 'all'}
            onChange={(e) => setFilteredStatus(e.target.value)}
          />
          <Form.Check
            type="radio"
            label="Satın Alınanlar"
            name="status"
            value="bought"
            checked={filteredStatus === 'bought'}
            onChange={(e) => setFilteredStatus(e.target.value)}
          />
          <Form.Check
            type="radio"
            label="Satın Alınmayanlar"
            name="status"
            value="notBought"
            checked={filteredStatus === 'notBought'}
            onChange={(e) => setFilteredStatus(e.target.value)}
          />
        </StyledFormGroup>
        <StyledFormGroup>
          <Form.Label>Ürün Adı</Form.Label>
          <Form.Control
            type="text"
            value={filteredName}
            onChange={(e) => setFilteredName(e.target.value)}
          />
        </StyledFormGroup>
      </StyledForm>

      {alertVisible && (
        <StyledAlert onClose={() => setAlertVisible(false)} dismissible>
          Alışveriş Tamamlandı!
        </StyledAlert>
      )}
      <HR></HR>

      {/* Products Table */}
      <StyledTable striped bordered hover>
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Market</th>
            <th>Kategori</th>
            <th>Durum</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id} style={{ textDecoration: product.isBought ? 'line-through' : 'none' }}>
              <td>{product.name}</td>
              <td>{product.shop}</td>
              <td>{product.category}</td>
              <td>
                <StyledButton onClick={() => handleToggleBought(product.id)}>
                  {product.isBought ? 'Satın Alındı' : 'Satın Al'}
                </StyledButton>
              </td>
              <td>
                <StyledButton variant="danger" onClick={() => handleDeleteProduct(product.id)}>Sil</StyledButton>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>

      
    </StyledContainer>
  );
};

export default App;
