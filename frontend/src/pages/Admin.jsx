import { useEffect, useState } from "react";
import {
  ADMIN_TABS,
  ADMIN_TOKEN_STORAGE_KEY,
  DEFAULT_ADMIN_TOKEN,
} from "../data/admin";
import { apiRequest } from "../api";
import "../styles/pages/admin.css";

const STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];
const EMPTY_PRODUCT = {
  id: "",
  name: "",
  price: "",
  stock: "",
  category: "normal",
  tag: "",
  img: "/images/products/packets.jpeg",
  desc: "",
  features: "",
};
const EMPTY_PROMO = { code: "", discount: "", label: "", active: true };
const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-NP")}`;
const DEMO_SUMMARY = {
  totalOrders: 18,
  sales: { revenue: 482500, orders: 18, items: 94 },
  byStatus: {
    pending: 2,
    confirmed: 3,
    packed: 4,
    shipped: 4,
    delivered: 5,
    cancelled: 0,
  },
  salesByDay: [
  ],
};

export default function Admin() {
  const [token, setToken] = useState(
    () => localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || DEFAULT_ADMIN_TOKEN,
  );
  const [tokenInput, setTokenInput] = useState(DEFAULT_ADMIN_TOKEN);
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promos, setPromos] = useState([]);
  const [summary, setSummary] = useState(DEMO_SUMMARY);
  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [promo, setPromo] = useState(EMPTY_PROMO);
  const [editingId, setEditingId] = useState(null);
  const [editingPromo, setEditingPromo] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderSort, setOrderSort] = useState("newest");
  const [notice, setNotice] = useState(null);
  const [newToken, setNewToken] = useState("");
  const [confirmToken, setConfirmToken] = useState("");

  const request = async (path, options = {}) => {
    return apiRequest(path, {
      ...options,
      headers: {
        "x-admin-token": token,
        ...(options.headers || {}),
      },
    });
  };
  const load = async () => {
    try {
      const [catalog, orderList, totals, promoList] = await Promise.all([
        request("/admin/products"),
        request("/admin/orders"),
        request("/admin/summary"),
        request("/admin/promos"),
      ]);
      setProducts(catalog.products);
      setOrders(orderList.orders);
      setSummary(
        totals?.totalOrders || totals?.salesByDay?.length
          ? totals
          : DEMO_SUMMARY,
      );
      setPromos(promoList.promos);
      setNotice(null);
    } catch (error) {
      setNotice({ type: "error", text: error.message });
      if (error.message.includes("authentication")) {
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
        setToken("");
      }
    }
  };
  useEffect(() => {
    if (token) load();
  }, [token]);

  if (!token)
    return (
      <main className="admin-auth">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, tokenInput.trim());
            setToken(tokenInput.trim());
          }}
          className="admin-auth-card"
        >
          <span className="admin-kicker">Golden Roots / Operations</span>
          <h1>Admin sign in</h1>
          <p>Enter the admin token configured for the API.</p>
          <label>
            Admin token
            <input
              type="password"
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              autoFocus
            />
          </label>
          <button className="btn" type="submit">
            Open dashboard
          </button>
          <small>Development default: {DEFAULT_ADMIN_TOKEN}</small>
        </form>
      </main>
    );

  const saveProduct = async (event) => {
    event.preventDefault();
    try {
      const editing = Boolean(editingId);
      const payload = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        features: product.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      const result = await request(
        editing ? `/admin/products/${editingId}` : "/admin/products",
        { method: editing ? "PUT" : "POST", body: JSON.stringify(payload) },
      );
      setProducts((items) =>
        editing
          ? items.map((item) => (item.id === editingId ? result.product : item))
          : [...items, result.product],
      );
      setProduct(EMPTY_PRODUCT);
      setEditingId(null);
      setNotice({
        type: "success",
        text: editing ? "Product updated" : "Product added",
      });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  };
  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await request(`/admin/products/${id}`, { method: "DELETE" });
      setProducts((items) => items.filter((item) => item.id !== id));
      setNotice({ type: "success", text: "Product deleted" });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  };
  const updateStatus = async (id, status) => {
    try {
      const result = await request(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders((items) =>
        items.map((item) => (item.id === id ? result.order : item)),
      );
      setSummary(await request("/admin/summary"));
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  };
  const savePromo = async (event) => {
    event.preventDefault();
    try {
      const editing = Boolean(editingPromo);
      const result = await request(
        editing ? `/admin/promos/${editingPromo}` : "/admin/promos",
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify({ ...promo, discount: Number(promo.discount) }),
        },
      );
      setPromos((items) =>
        editing
          ? items.map((item) =>
              item.code === editingPromo ? result.promo : item,
            )
          : [...items, result.promo],
      );
      setPromo(EMPTY_PROMO);
      setEditingPromo(null);
      setNotice({
        type: "success",
        text: editing ? "Promo updated" : "Promo added",
      });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  };
  const removePromo = async (code) => {
    if (!window.confirm(`Delete promo code ${code}?`)) return;
    try {
      await request(`/admin/promos/${code}`, { method: "DELETE" });
      setPromos((items) => items.filter((item) => item.code !== code));
      setNotice({ type: "success", text: "Promo deleted" });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  };
  const changeToken = async (event) => {
    event.preventDefault();
    if (newToken.length < 8 || newToken !== confirmToken)
      return setNotice({
        type: "error",
        text:
          newToken.length < 8
            ? "Admin token must be at least 8 characters"
            : "The token confirmation does not match",
      });
    try {
      await request("/admin/token", {
        method: "PATCH",
        body: JSON.stringify({ token: newToken }),
      });
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, newToken);
      setToken(newToken);
      setNewToken("");
      setConfirmToken("");
      setNotice({ type: "success", text: "Admin token updated" });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  };

  const visibleProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.includes(search.toLowerCase()),
  );
  const signOut = () => {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setToken("");
  };
  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Golden Roots / Operations</span>
          <h1>Control room</h1>
        </div>
        <div className="admin-actions">
          <button className="btn btn-outline btn-small" onClick={load}>
            <i className="fas fa-sync-alt" /> Refresh
          </button>
          <button className="btn btn-dark btn-small" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>
      <nav className="admin-tabs">
        {ADMIN_TABS.map((item) => (
          <button
            key={item.id}
            className={tab === item.id ? "active" : ""}
            onClick={() => setTab(item.id)}
          >
            <i className={`fas ${item.icon}`} />
            {item.label}
          </button>
        ))}
      </nav>
      {notice && (
        <div className={`admin-notice ${notice.type}`}>
          {notice.text}
          <button onClick={() => setNotice(null)}>&times;</button>
        </div>
      )}
      {tab === "overview" && <Overview summary={summary} />}
      {tab === "products" && (
        <Products
          products={visibleProducts}
          totalProducts={products.length}
          search={search}
          setSearch={setSearch}
          product={product}
          setProduct={setProduct}
          editingId={editingId}
          setEditingId={setEditingId}
          saveProduct={saveProduct}
          removeProduct={removeProduct}
        />
      )}
      {tab === "promos" && (
        <Promos
          promos={promos}
          promo={promo}
          setPromo={setPromo}
          editingPromo={editingPromo}
          setEditingPromo={setEditingPromo}
          savePromo={savePromo}
          removePromo={removePromo}
        />
      )}
      {tab === "orders" && (
        <Orders
          orders={orders}
          expandedOrder={expandedOrder}
          setExpandedOrder={setExpandedOrder}
          updateStatus={updateStatus}
          orderSearch={orderSearch}
          setOrderSearch={setOrderSearch}
          orderSort={orderSort}
          setOrderSort={setOrderSort}
        />
      )}
      {tab === "settings" && (
        <Settings
          newToken={newToken}
          setNewToken={setNewToken}
          confirmToken={confirmToken}
          setConfirmToken={setConfirmToken}
          changeToken={changeToken}
        />
      )}
    </main>
  );
}

function Overview({ summary }) {
  return (
    <section className="admin-view">
      <div className="admin-stats">
        <div>
          <span>Total revenue</span>
          <strong>{money(summary.sales.revenue)}</strong>
        </div>
        <div>
          <span>Orders</span>
          <strong>{summary.totalOrders || 0}</strong>
        </div>
        <div>
          <span>Items sold</span>
          <strong>{summary.sales.items || 0}</strong>
        </div>
        <div>
          <span>Delivered</span>
          <strong>{summary.byStatus.delivered || 0}</strong>
        </div>
      </div>
      <div className="admin-overview-grid">
        <div className="admin-panel sales-chart-panel">
          <span className="admin-kicker">Performance</span>
          <h2>Sales, last 7 days</h2>
          <SalesChart points={summary.salesByDay} />
        </div>
        <div className="admin-panel">
          <span className="admin-kicker">Fulfilment</span>
          <h2>Order pipeline</h2>
          <div className="pipeline">
            {STATUSES.map((status) => (
              <div key={status}>
                <strong>{summary.byStatus[status] || 0}</strong>
                <span>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SalesChart({ points = [] }) {
  const [activePoint, setActivePoint] = useState(null);
  const width = 640;
  const height = 240;
  const chartTop = 18;
  const chartBottom = 42;
  const chartHeight = height - chartTop - chartBottom;
  const coords = points.map((point, index) => ({
    ...point,
    revenue: Number(point.revenue) || 0,
    x: points.length > 1 ? (index / (points.length - 1)) * width : width / 2,
    y: chartTop + chartHeight - ((Number(point.revenue) || 0) / Math.max(...points.map((entry) => Number(entry.revenue) || 0), 1)) * chartHeight,
  }));

  if (!coords.length) {
    return <div className="sales-chart-empty">No sales data available yet.</div>;
  }

  const totalRevenue = coords.reduce((total, point) => total + point.revenue, 0);
  const peak = coords.reduce((highest, point) => point.revenue > highest.revenue ? point : highest, { revenue: 0 });
  const firstRevenue = coords[0].revenue;
  const latestRevenue = coords[coords.length - 1].revenue;
  const previousRevenue = coords.length > 1 ? coords[coords.length - 2].revenue : latestRevenue;
  const latestChange = latestRevenue - previousRevenue;
  const overallChange = latestRevenue - firstRevenue;
  const percentageChange = firstRevenue ? Math.round((overallChange / firstRevenue) * 100) : null;
  const formatMoney = (value) => `Rs. ${value.toLocaleString("en-NP")}`;
  const trend = (value) => value > 0 ? "up" : value < 0 ? "down" : "flat";

  return (
    <div className="sales-chart" onMouseLeave={() => setActivePoint(null)}>
      <div className="sales-chart-summary">
        <div>
          <span>7-day revenue</span>
          <strong>{formatMoney(totalRevenue)}</strong>
        </div>
        <div>
          <span>Daily average</span>
          <strong>{formatMoney(Math.round(totalRevenue / coords.length))}</strong>
        </div>
        <div>
          <span>Best day</span>
          <strong>{formatMoney(peak.revenue)}</strong>
        </div>
        <div className={`sales-trend sales-trend-${trend(overallChange)}`}>
          <span>Overall trend</span>
          <strong>
            <i className={`fas fa-arrow-${trend(overallChange) === "flat" ? "right" : trend(overallChange)}`} />{' '}
            {percentageChange === null ? "New data" : `${Math.abs(percentageChange)}%`}
          </strong>
        </div>
      </div>
      <div className={`sales-chart-change sales-trend-${trend(latestChange)}`}>
        <i className={`fas fa-arrow-${trend(latestChange) === "flat" ? "right" : trend(latestChange)}`} />
        {latestChange === 0 ? "No change from the previous day" : `${formatMoney(Math.abs(latestChange))} ${latestChange > 0 ? "increase" : "decrease"} from the previous day`}
      </div>
      <div className="sales-chart-plot">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Sales revenue for the last seven days"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = chartTop + chartHeight * ratio;
          return (
            <line
              key={ratio}
              x1="0"
              x2={width}
              y1={y}
              y2={y}
              className="sales-chart-gridline"
            />
          );
        })}
        {coords.slice(1).map((point, index) => {
          const previous = coords[index];
          return (
            <line
              key={`${previous.date}-${point.date}`}
              x1={previous.x}
              y1={previous.y}
              x2={point.x}
              y2={point.y}
              className={`sales-chart-segment sales-trend-${trend(point.revenue - previous.revenue)}`}
            />
          );
        })}
        {coords.map((point) => (
          <g
            key={point.date}
            tabIndex="0"
            role="button"
            aria-label={`${point.label}: ${formatMoney(point.revenue)}`}
            onMouseEnter={() => setActivePoint(point)}
            onFocus={() => setActivePoint(point)}
            onBlur={() => setActivePoint(null)}
          >
            <circle cx={point.x} cy={point.y} r="12" className="sales-chart-hit-area" />
            <circle cx={point.x} cy={point.y} r="5" className="sales-chart-point" />
            <text x={point.x} y={height - 10} textAnchor="middle">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      {activePoint && (
        <div
          className="sales-chart-tooltip"
          style={{ left: `${(activePoint.x / width) * 100}%` }}
        >
          <strong>{activePoint.label}</strong>
          <span>{formatMoney(activePoint.revenue)}</span>
        </div>
      )}
      </div>
    </div>
  );
}

function Products({
  products,
  totalProducts,
  search,
  setSearch,
  product,
  setProduct,
  editingId,
  setEditingId,
  saveProduct,
  removeProduct,
}) {
  return (
    <section className="admin-view admin-grid">
      <div className="admin-panel admin-products">
        <div className="panel-heading">
          <div>
            <span className="admin-kicker">Catalog</span>
            <h2>Products <small className="count-label">TotalVariants: {totalProducts}</small></h2>
          </div>
          <input
            className="admin-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
          />
        </div>
        <div className="product-admin-list">
          {products.map((item) => (
            <article className="product-admin-row" key={item.id}>
              <img src={item.img} alt="" />
              <div>
                <strong>{item.name}</strong>
                <span>
                  {item.id} · {money(item.price)} · {item.stock} in stock
                </span>
              </div>
              <div className="row-actions">
                <button
                  className="icon-button"
                  onClick={() => {
                    setProduct({ ...item, features: item.features.join(", ") });
                    setEditingId(item.id);
                  }}
                  title="Edit product"
                >
                  <i className="fas fa-pen" />
                </button>
                <button
                  className="icon-button danger"
                  onClick={() => removeProduct(item.id)}
                  title="Delete product"
                >
                  <i className="fas fa-trash" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <form className="admin-panel product-editor" onSubmit={saveProduct}>
        <h2>{editingId ? "Edit product" : "Add product"}</h2>
        <div className="admin-form-grid">
          <label>
            Product ID
            <input
              required
              value={product.id}
              disabled={Boolean(editingId)}
              onChange={(event) =>
                setProduct({ ...product, id: event.target.value })
              }
            />
          </label>
          <label>
            Name
            <input
              required
              value={product.name}
              onChange={(event) =>
                setProduct({ ...product, name: event.target.value })
              }
            />
          </label>
          <label>
            Price
            <input
              required
              type="number"
              min="0"
              value={product.price}
              onChange={(event) =>
                setProduct({ ...product, price: event.target.value })
              }
            />
          </label>
          <label>
            Stock
            <input
              required
              type="number"
              min="0"
              value={product.stock}
              onChange={(event) =>
                setProduct({ ...product, stock: event.target.value })
              }
            />
          </label>
          <label>
            Category
            <select
              value={product.category}
              onChange={(event) =>
                setProduct({ ...product, category: event.target.value })
              }
            >
              <option value="normal">Normal</option>
              <option value="new">New</option>
              <option value="best">Best seller</option>
            </select>
          </label>
          <label>
            Tag
            <input
              value={product.tag}
              onChange={(event) =>
                setProduct({ ...product, tag: event.target.value })
              }
            />
          </label>
        </div>
        <label>
          Image path
          <input
            value={product.img}
            onChange={(event) =>
              setProduct({ ...product, img: event.target.value })
            }
          />
        </label>
        <label>
          Description
          <textarea
            rows="3"
            value={product.desc}
            onChange={(event) =>
              setProduct({ ...product, desc: event.target.value })
            }
          />
        </label>
        <label>
          Features <small>comma separated</small>
          <input
            value={product.features}
            onChange={(event) =>
              setProduct({ ...product, features: event.target.value })
            }
          />
        </label>
        <button className="btn" type="submit">
          {editingId ? "Save changes" : "Add product"}
        </button>
      </form>
    </section>
  );
}

function Promos({
  promos,
  promo,
  setPromo,
  editingPromo,
  setEditingPromo,
  savePromo,
  removePromo,
}) {
  return (
    <section className="admin-view admin-grid">
      <div className="admin-panel">
        <h2>Promo codes</h2>
        <div className="promo-list">
          {promos.map((item) => (
            <article className="promo-row" key={item.code}>
              <div>
                <strong>{item.code}</strong>
                <span>
                  {item.label} · {item.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="row-actions">
                <button
                  className="icon-button"
                  onClick={() => {
                    setPromo(item);
                    setEditingPromo(item.code);
                  }}
                  title="Edit promo"
                >
                  <i className="fas fa-pen" />
                </button>
                <button
                  className="icon-button danger"
                  onClick={() => removePromo(item.code)}
                  title="Delete promo"
                >
                  <i className="fas fa-trash" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <form className="admin-panel product-editor" onSubmit={savePromo}>
        <h2>{editingPromo ? "Edit promo" : "Add promo"}</h2>
        <label>
          Code
          <input
            required
            value={promo.code}
            disabled={Boolean(editingPromo)}
            onChange={(event) =>
              setPromo({ ...promo, code: event.target.value.toUpperCase() })
            }
          />
        </label>
        <label>
          Discount percentage
          <input
            required
            type="number"
            min="1"
            max="100"
            value={promo.discount ? promo.discount * 100 : ""}
            onChange={(event) =>
              setPromo({ ...promo, discount: Number(event.target.value) / 100 })
            }
          />
        </label>
        <label>
          Label
          <input
            value={promo.label}
            onChange={(event) =>
              setPromo({ ...promo, label: event.target.value })
            }
            placeholder="15% off"
          />
        </label>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={promo.active}
            onChange={(event) =>
              setPromo({ ...promo, active: event.target.checked })
            }
          />{" "}
          Active
        </label>
        <button className="btn" type="submit">
          {editingPromo ? "Save changes" : "Add promo"}
        </button>
      </form>
    </section>
  );
}

function Orders({
  orders,
  expandedOrder,
  setExpandedOrder,
  updateStatus,
  orderSearch,
  setOrderSearch,
  orderSort,
  setOrderSort,
}) {
  const visibleOrders = [...orders]
    .filter((order) => {
      const searchTerm = orderSearch.trim().toLowerCase();
      if (!searchTerm) return true;
      return [
        order.id,
        order.customer?.firstName,
        order.customer?.lastName,
        order.customer?.email,
        order.customer?.phone,
        order.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm);
    })
    .sort((a, b) => {
      switch (orderSort) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "total-high":
          return b.total - a.total;
        case "total-low":
          return a.total - b.total;
        case "status":
          return a.status.localeCompare(b.status);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <section className="admin-view admin-panel orders-panel">
      <div className="panel-heading">
        <div>
          <span className="admin-kicker">Operations</span>
          <h2>Order management</h2>
        </div>
        <div
          className="filter-sort"
          style={{ gap: "0.75rem", alignItems: "center" }}
        >
          <input
            className="admin-search"
            value={orderSearch}
            onChange={(event) => setOrderSearch(event.target.value)}
            placeholder="Search orders"
            aria-label="Search orders"
            style={{ maxWidth: "240px" }}
          />
          <label>
            Sort
            <select
              value={orderSort}
              onChange={(event) => setOrderSort(event.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="total-high">Total: High to Low</option>
              <option value="total-low">Total: Low to High</option>
              <option value="status">Status</option>
            </select>
          </label>
        </div>
      </div>
      <div className="orders-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                expanded={expandedOrder === order.id}
                onToggle={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
                updateStatus={updateStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OrderRow({ order, expanded, onToggle, updateStatus }) {
  return (
    <>
      <tr>
        <td>
          <button className="order-toggle" onClick={onToggle}>
            <i className={`fas fa-chevron-${expanded ? "down" : "right"}`} />{" "}
            {order.id}
          </button>
          <small>{order.payment}</small>
        </td>
        <td>
          {order.customer.firstName} {order.customer.lastName}
          <small>{order.customer.city}</small>
        </td>
        <td>{order.items.reduce((sum, item) => sum + item.qty, 0)}</td>
        <td>
          <strong>{money(order.total)}</strong>
        </td>
        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
        <td>
          <select
            className={`status status-${order.status}`}
            value={order.status}
            onChange={(event) => updateStatus(order.id, event.target.value)}
          >
            {STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className="order-detail-row">
          <td colSpan="6">
            <div className="order-details">
              <div>
                <strong>Customer</strong>
                <span>
                  {order.customer.firstName} {order.customer.lastName}
                </span>
                <span>
                  {order.customer.email} · {order.customer.phone}
                </span>
                <span>
                  {order.customer.address}, {order.customer.city},{" "}
                  {order.customer.province} {order.customer.postal}
                </span>
              </div>
              <div>
                <strong>Items</strong>
                {order.items.map((item) => (
                  <span key={item.id}>
                    {item.name} × {item.qty} · {money(item.lineTotal)}
                  </span>
                ))}
              </div>
              <div>
                <strong>Payment & totals</strong>
                <span>
                  {order.payment} · Subtotal {money(order.subtotal)}
                </span>
                <span>
                  Discount {money(order.discount)} · Tax {money(order.tax)}
                </span>
                <strong>Total {money(order.total)}</strong>
                {order.payment !== "cod" && (
                  order.paymentProof ? (
                    <a
                      className="payment-proof-link"
                      href={order.paymentProof}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src={order.paymentProof} alt={`${order.payment} payment proof`} />
                      View payment screenshot
                    </a>
                  ) : (
                    <span className="payment-proof-missing">No payment screenshot uploaded</span>
                  )
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Settings({
  newToken,
  setNewToken,
  confirmToken,
  setConfirmToken,
  changeToken,
}) {
  return (
    <section className="admin-view settings-grid">
      <div className="admin-panel">
        <h2>Admin access</h2>
        <form className="token-form" onSubmit={changeToken}>
          <label>
            New admin token
            <input
              type="password"
              minLength="8"
              value={newToken}
              onChange={(event) => setNewToken(event.target.value)}
            />
          </label>
          <label>
            Confirm new token
            <input
              type="password"
              minLength="8"
              value={confirmToken}
              onChange={(event) => setConfirmToken(event.target.value)}
            />
          </label>
          <button className="btn" type="submit">
            Update admin token
          </button>
        </form>
      </div>
    </section>
  );
}
