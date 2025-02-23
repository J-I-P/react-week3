import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import Pagination from "../components/Pagination";


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
  };

function ProductPage({setIsAuth}) {
    const [products, setProducts] = useState([]);
    const [modalMode, setmodalMode] = useState(null);

    const getProducts = async (page = 1) => {
        try {
          const res = await axios.get(
            `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
          );
          setProducts(res.data.products);
          setPageInfo(res.data.pagination);
        } catch (error) {
          alert("取得產品失敗");
        }
      };

    useEffect(() => {  
        getProducts();
      }, []);
  const checkUserLogin = async () => {
    try {
      
      await axios.post(`${BASE_URL}/v2/api/user/check`);

      setIsAuth(true);
      getProducts();
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => { 
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );

    axios.defaults.headers.common["Authorization"] = token;
    checkUserLogin(); 
  }, []);

  const productModal = useRef(null);
  const deleteproductModal = useRef(null);


  useEffect(() => {
    // const modal = Modal.getOrCreateInstance(productModal.current);
    // modal.show();
    console.log(productModal.current);
    new Modal(productModal.current, {
      backdrop: false,
    });

    new Modal(deleteproductModal.current, {
      backdrop: false,
    });
    // Modal.getInstance(productModal.current);
  }, []);



    const handleCloseModal = () => {
        const modal = Modal.getOrCreateInstance(productModal.current);
        modal.hide();
      };
    
    
      
    
    
      const handledeleteCloseModal = () => {
        const modal = Modal.getOrCreateInstance(deleteproductModal.current);
        modal.hide();
      };
    
      const [tempProduct, setTempProduct] = useState({defaultModalState});
    
    
      const handleModalInputChange = (e) => {
        const { value, name, checked, type } = e.target;
    
        setTempProduct({
          ...tempProduct,
          [name]: type === "checkbox" ? checked : value,
        });
      };
    
      const handleImageChange = (e, index) => {
        const { value } = e.target;
        const newImages = [...tempProduct.imagesUrl];
    
        newImages[index] = value;
        setTempProduct({
          ...tempProduct,
          imagesUrl: newImages,
        });
      };
    
    
      const handleAddImage = () => {
        const newImages = [...tempProduct.imagesUrl, ''];
        setTempProduct({
          ...tempProduct,
          imagesUrl: newImages,
        });
      };
    
      const handleRemoveImage = () => {
        const newImages = [...tempProduct.imagesUrl];
        newImages.pop();
        setTempProduct({
          ...tempProduct,
          imagesUrl: newImages,
        });
      };
      
    
      const createProduct = async () => {
        try {
          await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
            data: {
              ...tempProduct,
              origin_price: Number(tempProduct.origin_price),
              price: Number(tempProduct.price),
              is_enabled: tempProduct.is_enabled?1:0
            },
          });
        } catch (error) {
          console.error("失敗");
        }
      };
      const updateProduct = async () => {
        try {
          await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`, {
            data: {
              ...tempProduct,
              origin_price: Number(tempProduct.origin_price),
              price: Number(tempProduct.price),
              is_enabled: tempProduct.is_enabled?1:0
            },
          });
        } catch (error) {
          console.error("更新失敗");
        }
      };
      
    
      const handleUpdateProduct = async () => {
        const apiCall = modalMode === "create" ? createProduct : updateProduct;
        try {
          await apiCall();
          handleCloseModal();
          getProducts();
          console.log("更新成功");
          
        } catch (error) {
          alert("失敗");
        }
        
      };
    
    
      const deleteProduct = async () => {
        try {
          await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`);
        } catch (error) {
          console.error("刪除失敗");
        }
      };
    
      const handleDeleteProduct = async () => {
        try {
          await deleteProduct();
          handledeleteCloseModal();
          getProducts();
        } catch (error) {
          alert("刪除產品失敗");
        }
      }
    
      
      
      const handleFileInputChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file-to-upload", file);
    
        try {
          const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData);
          const uploadedImageUrl = res.data.imageUrl;
          setTempProduct({
            ...tempProduct,
            imageUrl: uploadedImageUrl
          })
        }catch (error) {
          alert("上傳失敗");
        }
    
      }
    const handleOpenModal = (mode, product) => {
        setmodalMode(mode);
        switch (mode) {
          case "create":
            setTempProduct(defaultModalState);
            break;
          case "edit":
            setTempProduct(product);
            break;
        }
        const modal = Modal.getOrCreateInstance(productModal.current);
        modal.show();
    };

    
    const handledeleteOpenModal = (product) => {
        setTempProduct(product);
        const modal = Modal.getOrCreateInstance(deleteproductModal.current);
        modal.show();
    };
    const [pageInfo, setPageInfo] = useState({
    
    })
  
    const handlePageChange = async (page) => {
      try {
        getProducts(page);
      } catch (error) {
        alert("取得產品失敗");
      }
    }

    return (
        <>  
            <div className="container py-5">
                <div className="row">
                    <div className="col">
                    <div className="d-flex justify-content-between">
                        <h2>產品列表</h2>
                        <button onClick={() => handleOpenModal("create")} type="button" className="btn btn-primary">建立新的產品</button>
                    </div>
                    
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">產品名稱</th>
                            <th scope="col">原價</th>
                            <th scope="col">售價</th>
                            <th scope="col">是否啟用</th>
                            <th scope="col">查看細節</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                            <th scope="row">{product.title}</th>
                            <td>{product.origin_price}</td>
                            <td>{product.price}</td>
                            <td>{product.is_enabled? (<span className="text-success">啟用</span>):(<span className="text-danger">未啟用</span>)}</td>
                            <td>
                            <div className="btn-group">
                                <button onClick={() => handleOpenModal("edit", product)} type="button" className="btn btn-outline-primary btn-sm">編輯</button>
                                <button onClick={() => handledeleteOpenModal(product)} type="button" className="btn btn-outline-danger btn-sm">刪除</button>
                            </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>

                </div>
                <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
            </div>

            <div ref ={productModal} id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow">
                <div className="modal-header border-bottom">
                <h5 className="modal-title fs-4">{modalMode==="create"?"新增產品":"編輯產品"}</h5>
                <button onClick={handleCloseModal} type="button" className="btn-close" aria-label="Close"></button>
                </div>

                <div className="modal-body p-4">
                <div className="row g-4">
                    <div className="col-md-4">
                    <div className="mb-5">
                    <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="form-control"
                        id="fileInput"
                        onChange={handleFileInputChange}
                    />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="primary-image" className="form-label">
                        主圖
                        </label>
                        <div className="input-group">
                        <input
                            name="imageUrl"
                            value={tempProduct.imageUrl}
                            onChange={handleModalInputChange}
                            type="text"
                            id="primary-image"
                            className="form-control"
                            placeholder="請輸入圖片連結"
                        />
                        </div>
                        <img
                        src={tempProduct.imageUrl}
                        alt={tempProduct.title}
                        className="img-fluid"
                        />
                    </div>

                    {/* 副圖 */}
                    <div className="border border-2 border-dashed rounded-3 p-3">
                        {tempProduct.imagesUrl?.map((image, index) => (
                        <div key={index} className="mb-2">
                            <label
                            htmlFor={`imagesUrl-${index + 1}`}
                            className="form-label"
                            >
                            副圖 {index + 1}
                            </label>
                            <input
                            value={image}
                            onChange={(e) => handleImageChange(e, index)}
                            id={`imagesUrl-${index + 1}`}
                            type="text"
                            placeholder={`圖片網址 ${index + 1}`}
                            className="form-control mb-2"
                            />
                            {image && (
                            <img
                                src={image}
                                alt={`副圖 ${index + 1}`}
                                className="img-fluid mb-2"
                            />
                            )}
                        </div>
                        ))}
                        <div className="btn-group w-100">
                        {tempProduct.imagesUrl?.length < 5 && (
                            tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== "" && (
                            <button onClick={handleAddImage} className="btn btn-outline-primary btn-sm w-100">新增圖片</button>
                            )
                        )}
                        
                        {tempProduct.imagesUrl?.length>1 && (
                            <button onClick={handleRemoveImage} className="btn btn-outline-danger btn-sm w-100">取消圖片</button>
                        )}
                        
                        </div>
                    </div>
                    </div>

                    <div className="col-md-8">
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                        標題
                        </label>
                        <input
                        name="title"
                        value={tempProduct.title}
                        onChange={handleModalInputChange}
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">
                        分類
                        </label>
                        <input
                        name="category"
                        value={tempProduct.category}
                        onChange={handleModalInputChange}
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="unit" className="form-label">
                        單位
                        </label>
                        <input
                        name="unit"
                        value={tempProduct.unit}
                        onChange={handleModalInputChange}
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        />
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-6">
                        <label htmlFor="origin_price" className="form-label">
                            原價
                        </label>
                        <input
                            name="origin_price"
                            value={tempProduct.origin_price}
                            onChange={handleModalInputChange}
                            id="origin_price"
                            type="number"
                            className="form-control"
                            placeholder="請輸入原價"
                        />
                        </div>
                        <div className="col-6">
                        <label htmlFor="price" className="form-label">
                            售價
                        </label>
                        <input
                            name="price"
                            value={tempProduct.price}
                            onChange={handleModalInputChange}
                            id="price"
                            type="number"
                            className="form-control"
                            placeholder="請輸入售價"
                        />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                        產品描述
                        </label>
                        <textarea
                        name="description"
                        value={tempProduct.description}
                        onChange={handleModalInputChange}
                        id="description"
                        className="form-control"
                        rows={4}
                        placeholder="請輸入產品描述"
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">
                        說明內容
                        </label>
                        <textarea
                        name="content"
                        value={tempProduct.content}
                        onChange={handleModalInputChange}
                        id="content"
                        className="form-control"
                        rows={4}
                        placeholder="請輸入說明內容"
                        ></textarea>
                    </div>

                    <div className="form-check">
                        <input
                        name="is_enabled"
                        checked={tempProduct.is_enabled}
                        onChange={handleModalInputChange}
                        type="checkbox"
                        className="form-check-input"
                        id="isEnabled"
                        />
                        <label className="form-check-label" htmlFor="isEnabled">
                        是否啟用
                        </label>
                    </div>
                    </div>
                </div>
                </div>

                <div className="modal-footer border-top bg-light">
                <button onClick={handleCloseModal} type="button" className="btn btn-secondary">
                    取消
                </button>
                <button onClick={handleUpdateProduct} type="button" className="btn btn-primary">
                    確認
                </button>
                </div>
            </div>
            </div>
            </div>

            <div
                ref ={deleteproductModal}
                className="modal fade"
                id="delProductModal"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h1 className="modal-title fs-5">刪除產品</h1>
                    <button
                        onClick={handledeleteCloseModal}
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                    </div>
                    <div className="modal-body">
                    你是否要刪除 
                    <span className="text-danger fw-bold">{tempProduct.title}</span>
                    </div>
                    <div className="modal-footer">
                    <button
                        onClick={handledeleteCloseModal}
                        type="button"
                        className="btn btn-secondary"
                    >
                        取消
                    </button>
                    <button onClick={handleDeleteProduct} type="button" className="btn btn-danger">
                        刪除
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </>
      )
}

export default ProductPage;