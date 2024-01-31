"use client"
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import {useEffect, useState} from 'react';
const DataTable = () => {
  const [rows, setRows] = useState([
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    sku: '',
    image: '',
  });

  useEffect(() => {
    // Fetch products from MongoDB when the component mounts
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const products = await response.json();
          setRows(products);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
  
      if (response.ok) {
        const addedProduct = await response.json();
        setRows((prevRows) => [...prevRows, addedProduct]);
        setOpenDialog(false);
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProduct = (id) => {
    const productToEdit = rows.find((row) => row._id === id);
    setNewProduct({ ...productToEdit });
    setOpenDialog(true);
  };
 
  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${newProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === updatedProduct.id ? updatedProduct : row))
        );
        setOpenDialog(false);
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRows((prevRows) => prevRows.filter((row) => row._id !== id));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleOpenDialog = (isAdding) => {
    if (isAdding) {
      setNewProduct({
        name: '',
        price: 0,
        sku: '',
        image: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 200},
    { field: 'name', headerName: 'Product Name', width: 300 },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      width: 90,
    },
    { field: 'sku', headerName: 'SKU', width: 200 },
    {
      field: 'image',
      headerName: 'Image',
      width: 130,
      headerAlign: 'center',
      renderCell: (params) => (
        <img
          src={params.row.image}
          alt={params.row.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      width: 270,
      headerAlign: 'center',
      renderCell: (params) => (
        <>
          <Button
            className="m-10"
            variant="outlined"
            onClick={() => handleEditProduct(params.row._id)}
          >
            Edit
          </Button>
          <Button
            className="m-10"
            variant="outlined"
            color="error"
            onClick={() => handleDeleteProduct(params.row._id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button className="mx-10 mt-20" variant="outlined" onClick={() => handleOpenDialog(true)}>
        Add Product
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{newProduct._id ? 'Edit' : 'Add'} Product</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              label="Product Name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="SKU"
              name="sku"
              value={newProduct.sku}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Image URL"
              name="image"
              value={newProduct.image}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button variant="outlined" onClick={newProduct._id ? handleUpdateProduct : handleAddProduct}>
              {newProduct._id ? 'Save' : 'Add'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-white p-10" style={{ height: '400px', width: '100%' }}>
      <DataGrid
         rows={rows}
         columns={columns}
         getRowId={(row) => row._id} // Ensure this matches the property name in your data
        initialState={{
          pagination: {
            pageSize: 5,
          },
        }}
        pageSizeOptions={[5, 10]}
        disableSelectionOnClick
      />
      </div>
    </div>
  );
};

export default DataTable;
