"use client"

import { useState, useMemo } from "react"
import { TopBar } from "@/components/topbar"

// ─── Types ───────────────────────────────────────────────────────────────────
type Status = "In Stock" | "Low Stock" | "Overstocked"
type Category = "Footwear" | "Bags" | "Accessories" | "Clothing"

interface Product {
  id: string
  name: string
  category: Category
  stock: number
  price: string
  priceNum: number
  status: Status
}

// ─── Initial data ─────────────────────────────────────────────────────────────
const INIT_PRODUCTS: Product[] = [
  { id: "SKU001", name: "Running Shoes - Black",   category: "Footwear",     stock: 12, price: "₹2,499", priceNum: 2499, status: "Low Stock"   },
  { id: "SKU002", name: "Leather Bags - Brown",    category: "Bags",         stock: 37, price: "₹1,899", priceNum: 1899, status: "In Stock"    },
  { id: "SKU003", name: "Sports Cap - Navy",        category: "Accessories",  stock: 29, price: "₹499",   priceNum: 499,  status: "In Stock"    },
  { id: "SKU004", name: "Cotton T-shirt - White",  category: "Clothing",     stock: 76, price: "₹799",   priceNum: 799,  status: "Overstocked" },
  { id: "SKU005", name: "Analog Watch - Silver",   category: "Accessories",  stock: 45, price: "₹3,299", priceNum: 3299, status: "In Stock"    },
  { id: "SKU006", name: "Casual Sneakers - White", category: "Footwear",     stock: 8,  price: "₹2,199", priceNum: 2199, status: "Low Stock"   },
  { id: "SKU007", name: "Backpack - Grey",          category: "Bags",         stock: 22, price: "₹1,599", priceNum: 1599, status: "In Stock"    },
  { id: "SKU008", name: "Polo Shirt - Blue",        category: "Clothing",     stock: 54, price: "₹999",   priceNum: 999,  status: "In Stock"    },
]

const STATUS_COLORS: Record<Status, string> = {
  "In Stock":    "bg-[#00C896]/10 text-[#00C896]",
  "Low Stock":   "bg-destructive/10 text-destructive",
  "Overstocked": "bg-[#FFA940]/10 text-[#FFA940]",
}

const CATEGORIES: Category[] = ["Footwear", "Bags", "Accessories", "Clothing"]
const STATUSES: Status[]      = ["In Stock", "Low Stock", "Overstocked"]
const PAGE_SIZE = 8

// ─── helpers ─────────────────────────────────────────────────────────────────
function deriveStatus(stock: number): Status {
  if (stock <= 15) return "Low Stock"
  if (stock >= 60) return "Overstocked"
  return "In Stock"
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] bg-card border border-border rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3 text-[13px] text-foreground animate-in fade-in slide-in-from-bottom-4">
      <div className="w-2 h-2 rounded-full bg-[#00C896]" />
      {msg}
      <button onClick={onClose} className="ml-2 text-muted-foreground hover:text-foreground text-[11px]">✕</button>
    </div>
  )
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-[12px]">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide block mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full h-10 px-3 bg-secondary border border-input rounded-lg text-[13px] text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
const selectCls = "w-full h-10 px-3 bg-secondary border border-input rounded-lg text-[13px] text-foreground focus:border-primary focus:outline-none transition-all"

// ─── DataSourceCard ───────────────────────────────────────────────────────────
function DataSourceCard({ name, status, records, lastSync }: { name: string; status: "connected" | "syncing" | "error"; records: string; lastSync: string }) {
  const cfg = {
    connected: { color: "bg-[#00C896]",               text: "Connected"  },
    syncing:   { color: "bg-primary animate-pulse",    text: "Syncing..."  },
    error:     { color: "bg-destructive",              text: "Error"       },
  }
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-medium text-foreground">{name}</h3>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${cfg[status].color}`} />
          <span className="text-[10px] text-muted-foreground font-mono">{cfg[status].text}</span>
        </div>
      </div>
      <div className="flex justify-between text-[12px]">
        <span className="text-muted-foreground">Records</span>
        <span className="text-foreground font-mono">{records}</span>
      </div>
      <div className="flex justify-between text-[12px] mt-1">
        <span className="text-muted-foreground">Last sync</span>
        <span className="text-foreground font-mono">{lastSync}</span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DataPage() {
  const [products, setProducts]         = useState<Product[]>(INIT_PRODUCTS)
  const [search, setSearch]             = useState("")
  const [page, setPage]                 = useState(1)
  const [toast, setToast]               = useState("")

  // Filter state
  const [showFilter, setShowFilter]     = useState(false)
  const [filterCat, setFilterCat]       = useState<string>("All")
  const [filterStatus, setFilterStatus] = useState<string>("All")

  // Add Product modal
  const [showAdd, setShowAdd]           = useState(false)
  const [newName, setNewName]           = useState("")
  const [newCat, setNewCat]             = useState<Category>("Footwear")
  const [newStock, setNewStock]         = useState("")
  const [newPrice, setNewPrice]         = useState("")

  // Edit modal
  const [editTarget, setEditTarget]     = useState<Product | null>(null)
  const [editName, setEditName]         = useState("")
  const [editCat, setEditCat]           = useState<Category>("Footwear")
  const [editStock, setEditStock]       = useState("")
  const [editPrice, setEditPrice]       = useState("")

  // ── filtered & paginated ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
      const matchCat    = filterCat    === "All" || p.category === filterCat
      const matchStatus = filterStatus === "All" || p.status   === filterStatus
      return matchSearch && matchCat && matchStatus
    })
  }, [products, search, filterCat, filterStatus])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  // ── Add Product ───────────────────────────────────────────────────────────
  function handleAdd() {
    if (!newName.trim() || !newStock || !newPrice) {
      showToast("Please fill in all fields.")
      return
    }
    const stockNum = parseInt(newStock)
    const priceNum = parseInt(newPrice)
    const nextId   = `SKU${String(products.length + 1).padStart(3, "0")}`
    const newProduct: Product = {
      id: nextId, name: newName.trim(), category: newCat,
      stock: stockNum, price: `₹${priceNum.toLocaleString("en-IN")}`,
      priceNum, status: deriveStatus(stockNum),
    }
    setProducts((prev) => [newProduct, ...prev])
    setNewName(""); setNewCat("Footwear"); setNewStock(""); setNewPrice("")
    setShowAdd(false)
    showToast(`✓ ${newProduct.name} added successfully!`)
  }

  // ── Edit Product ──────────────────────────────────────────────────────────
  function openEdit(p: Product) {
    setEditTarget(p)
    setEditName(p.name)
    setEditCat(p.category)
    setEditStock(String(p.stock))
    setEditPrice(String(p.priceNum))
  }

  function handleEdit() {
    if (!editTarget || !editName.trim() || !editStock || !editPrice) {
      showToast("Please fill in all fields.")
      return
    }
    const stockNum = parseInt(editStock)
    const priceNum = parseInt(editPrice)
    setProducts((prev) => prev.map((p) =>
      p.id === editTarget.id
        ? { ...p, name: editName.trim(), category: editCat, stock: stockNum, priceNum, price: `₹${priceNum.toLocaleString("en-IN")}`, status: deriveStatus(stockNum) }
        : p
    ))
    setEditTarget(null)
    showToast("✓ Product updated successfully!")
  }

  // ── reset filters ──────────────────────────────────────────────────────────
  function resetFilters() {
    setFilterCat("All"); setFilterStatus("All"); setSearch(""); setPage(1)
    setShowFilter(false)
    showToast("Filters cleared.")
  }

  function applyFilters() {
    setPage(1); setShowFilter(false)
    showToast("Filters applied.")
  }

  return (
    <>
      <TopBar title="Data" subtitle="Manage your business data and inventory" />

      {/* Data Sources */}
      <div className="mb-6">
        <h2 className="text-[14px] font-medium text-foreground mb-3">Data Sources</h2>
        <div className="grid grid-cols-4 gap-3">
          <DataSourceCard name="Products"  status="connected" records={String(products.length)} lastSync="2 min ago"   />
          <DataSourceCard name="Orders"    status="syncing"   records="1,842"                   lastSync="Syncing..."   />
          <DataSourceCard name="Customers" status="connected" records="1,482"                   lastSync="5 min ago"    />
          <DataSourceCard name="Reviews"   status="connected" records="328"                     lastSync="1 hour ago"   />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">

        {/* Table header controls */}
        <div className="p-5 border-b border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <h3 className="text-[13px] font-medium text-foreground shrink-0">Product Inventory</h3>
            {/* Search */}
            <div className="flex items-center gap-2 bg-secondary border border-input rounded-lg px-3 h-8 text-[12px] text-muted-foreground ml-3 w-[220px]">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-3.5 shrink-0">
                <circle cx="7" cy="7" r="4"/><path d="M11 11l3 3"/>
              </svg>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search products..."
                className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full text-[12px]"
              />
              {search && <button onClick={() => { setSearch(""); setPage(1) }} className="text-muted-foreground hover:text-foreground text-[10px]">✕</button>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilter(true)}
              className={`text-[11px] px-3 py-1.5 rounded-lg font-mono transition-colors border ${
                (filterCat !== "All" || filterStatus !== "All")
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-secondary border-input text-muted-foreground hover:text-foreground"
              }`}
            >
              {(filterCat !== "All" || filterStatus !== "All") ? "● Filter (active)" : "Filter"}
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="text-[11px] px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-mono hover:bg-primary/90 transition-colors"
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {(filterCat !== "All" || filterStatus !== "All") && (
          <div className="px-5 py-2.5 border-b border-border flex items-center gap-2 bg-secondary/30">
            <span className="text-[10px] text-muted-foreground font-mono">Active filters:</span>
            {filterCat !== "All" && (
              <span className="text-[10px] bg-primary/10 border border-primary/25 text-primary px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                Category: {filterCat}
                <button onClick={() => { setFilterCat("All"); setPage(1) }} className="hover:text-white">×</button>
              </span>
            )}
            {filterStatus !== "All" && (
              <span className="text-[10px] bg-primary/10 border border-primary/25 text-primary px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                Status: {filterStatus}
                <button onClick={() => { setFilterStatus("All"); setPage(1) }} className="hover:text-white">×</button>
              </span>
            )}
            <button onClick={resetFilters} className="text-[10px] text-muted-foreground font-mono hover:text-destructive ml-auto transition-colors">Clear all</button>
          </div>
        )}

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["SKU","Product Name","Category","Stock","Price","Status","Actions"].map((h) => (
                <th key={h} className="text-left text-[10px] text-muted-foreground font-mono uppercase tracking-wide p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[13px] text-muted-foreground">No products match your filters.</td>
              </tr>
            ) : paged.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                <td className="p-4 text-[12px] text-muted-foreground font-mono">{product.id}</td>
                <td className="p-4 text-[13px] text-foreground">{product.name}</td>
                <td className="p-4 text-[12px] text-muted-foreground">{product.category}</td>
                <td className="p-4 text-[12px] text-foreground font-mono">{product.stock}</td>
                <td className="p-4 text-[12px] text-foreground font-mono">{product.price}</td>
                <td className="p-4">
                  <span className={`text-[10px] px-2 py-1 rounded-md font-mono ${STATUS_COLORS[product.status]}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => openEdit(product)} className="text-[11px] text-primary font-mono hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground font-mono">
            Showing {paged.length} of {filtered.length} products
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="text-[11px] px-3 py-1.5 bg-secondary text-muted-foreground rounded-lg font-mono disabled:opacity-40 hover:text-foreground transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`text-[11px] px-3 py-1.5 rounded-lg font-mono transition-colors ${
                  safePage === n ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="text-[11px] px-3 py-1.5 bg-secondary text-muted-foreground rounded-lg font-mono disabled:opacity-40 hover:text-foreground transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter Panel Modal ─────────────────────────────────────────── */}
      {showFilter && (
        <Modal title="Filter Products" onClose={() => setShowFilter(false)}>
          <div className="space-y-4">
            <Field label="Category">
              <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className={selectCls}>
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectCls}>
                <option value="All">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <div className="flex gap-2 pt-2">
              <button onClick={resetFilters} className="flex-1 h-10 bg-secondary border border-input rounded-lg text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                Reset
              </button>
              <button onClick={applyFilters} className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg text-[13px] font-medium hover:bg-primary/90 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Add Product Modal ──────────────────────────────────────────── */}
      {showAdd && (
        <Modal title="Add New Product" onClose={() => setShowAdd(false)}>
          <div className="space-y-4">
            <Field label="Product Name">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Running Shoes - Black" className={inputCls} />
            </Field>
            <Field label="Category">
              <select value={newCat} onChange={(e) => setNewCat(e.target.value as Category)} className={selectCls}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Stock (units)">
                <input type="number" min="0" value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="e.g. 50" className={inputCls} />
              </Field>
              <Field label="Price (₹)">
                <input type="number" min="0" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 1999" className={inputCls} />
              </Field>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 h-10 bg-secondary border border-input rounded-lg text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
              <button onClick={handleAdd} className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg text-[13px] font-medium hover:bg-primary/90 transition-colors">
                Add Product
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Edit Product Modal ─────────────────────────────────────────── */}
      {editTarget && (
        <Modal title={`Edit — ${editTarget.id}`} onClose={() => setEditTarget(null)}>
          <div className="space-y-4">
            <Field label="Product Name">
              <input value={editName} onChange={(e) => setEditName(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Category">
              <select value={editCat} onChange={(e) => setEditCat(e.target.value as Category)} className={selectCls}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Stock (units)">
                <input type="number" min="0" value={editStock} onChange={(e) => setEditStock(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Price (₹)">
                <input type="number" min="0" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className={inputCls} />
              </Field>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setEditTarget(null)} className="flex-1 h-10 bg-secondary border border-input rounded-lg text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
              <button onClick={handleEdit} className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg text-[13px] font-medium hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </>
  )
}
