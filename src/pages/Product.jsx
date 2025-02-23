import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import Pagination from "../components/Pagination";
import ProductModal from "../components/ProductModal";
import DeleteProductModal from "../components/DeleteProductModal";

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
  imagesUrl: [""],
};

function ProductPage({ setIsAuth }) {
  const [products, setProducts] = useState([]);
  const [modalMode, setmodalMode] = useState(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isProductDelteModalOpen, setIsProductDeleteModalOpen] =
    useState(false);
  const [pageInfo, setPageInfo] = useState({});

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
      "$1"
    );

    axios.defaults.headers.common["Authorization"] = token;
    checkUserLogin();
  }, []);

  const [tempProduct, setTempProduct] = useState({ defaultModalState });

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
    setIsProductModalOpen(true);
  };

  const handledeleteOpenModal = (product) => {
    setTempProduct(product);
    // const modal = Modal.getOrCreateInstance(deleteproductModal.current);
    // modal.show();
    setIsProductDeleteModalOpen(true);
  };

  const handlePageChange = async (page) => {
    try {
      getProducts(page);
    } catch (error) {
      alert("取得產品失敗");
    }
  };

  return (
    <>
      <div className="container py-5">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2>產品列表</h2>
              <button
                onClick={() => handleOpenModal("create")}
                type="button"
                className="btn btn-primary"
              >
                建立新的產品
              </button>
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
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span className="text-danger">未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() => handleOpenModal("edit", product)}
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handledeleteOpenModal(product)}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          刪除
                        </button>
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

      <ProductModal
        modalMode={modalMode}
        tempProduct={tempProduct}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        getProducts={getProducts}
      />

      <DeleteProductModal
        tempProduct={tempProduct}
        isOpen={isProductDelteModalOpen}
        setIsOpen={setIsProductDeleteModalOpen}
        getProducts={getProducts}
      />
    </>
  );
}

export default ProductPage;
