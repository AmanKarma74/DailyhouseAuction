"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./admin.scss";

// -----------------------------
// Small helper for fetch
// -----------------------------
async function fetchJSON(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Failed to load");
  }
  return data;
}

// -----------------------------
// User Table Component
// -----------------------------
const UserTable = ({ users, loading, onApprove, onReject, emptyText }) => {
  if (loading) {
    return <div className="admin-loading-block">Loading users…</div>;
  }

  if (!users || users.length === 0) {
    return <div className="admin-empty">{emptyText}</div>;
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name & Email</th>
            <th>Requested Role</th>
            <th>Contact</th>
            <th>Business / Occupation</th>
            <th>Working Area</th>
            <th>ID Proof</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>
                <div className="admin-user-main">
                  <span className="admin-user-name">{u.name}</span>
                  <span className="admin-user-email">{u.email}</span>
                </div>
              </td>
              <td>
                <span className="admin-badge-role">
                  {u.listingUser || "-"}
                </span>
                <div className="admin-subtext">
                  Onboarded: {u.onboarded ? "Yes" : "No"}
                </div>
              </td>
              <td>
                <div>{u.number || "-"}</div>
                <div className="admin-subtext">
                  {u.residentialAddress || ""}
                </div>
              </td>
              <td>
                {u.businessName || u.occupation || "-"}
                {u.operatingSince && (
                  <div className="admin-subtext">
                    Since: {u.operatingSince}
                  </div>
                )}
              </td>
              <td>{u.workingArea || "-"}</td>
              <td>
                {u.idProof ? (
                  <a
                    href={u.idProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-link"
                  >
                    View ID
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>
                <div className="admin-actions">
                  {onApprove && (
                    <button
                      className="admin-btn admin-btn-approve"
                      onClick={() => onApprove(u._id)}
                    >
                      Approve
                    </button>
                  )}
                  {onReject && (
                    <button
                      className="admin-btn admin-btn-reject"
                      onClick={() => onReject(u._id)}
                    >
                      Reject
                    </button>
                  )}
                  <Link href={`/user/${u._id}`}>
                    <button className="admin-btn admin-btn-ghost">
                      View
                    </button>
                  </Link>
                </div>
                {u.rejectReason && (
                  <div className="admin-reject-note">
                    Reason: {u.rejectReason}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// -----------------------------
// Property Table Component
// -----------------------------
const PropertyTable = ({ properties, loading }) => {
  if (loading) {
    return <div className="admin-loading-block">Loading properties…</div>;
  }

  if (!properties || properties.length === 0) {
    return <div className="admin-empty">No properties found.</div>;
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Basic Info</th>
            <th>Location</th>
            <th>Price</th>
            <th>Category</th>
            <th>Owner</th>
            <th>Created</th>
            <th>Open</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p._id}>
              <td>
                <div className="admin-user-main">
                  <span className="admin-user-name">
                    {p.propertyType || p.propertyCategory}
                  </span>
                  <span className="admin-user-email">
                    {p.postingPurpose} • {p.status || "N/A"}
                  </span>
                </div>
              </td>
              <td>
                {p.location}
                <div className="admin-subtext">
                  {p.city} • {p.buildingOrColonyName}
                </div>
              </td>
              <td>
                ₹{Number(p.price || 0).toLocaleString("en-IN")}
                {p.transactionType && (
                  <div className="admin-subtext">{p.transactionType}</div>
                )}
              </td>
              <td>{p.propertyCategory}</td>
              <td>
                {p.listedBy?.name || "-"}
                <div className="admin-subtext">
                  {p.listedBy?.email || ""}
                </div>
              </td>
              <td>
                {p.createdAt
                  ? new Date(p.createdAt).toLocaleDateString()
                  : "-"}
              </td>
              <td>
                <div className="admin-actions">
                  <Link href={`/property/${p._id}`}>
                    <button className="admin-btn admin-btn-ghost">
                      View
                    </button>
                  </Link>
                  {/* Future: Add verify / hide / delete buttons here */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// -----------------------------
// MAIN ADMIN PAGE
// -----------------------------
const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("users-pending");

  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [properties, setProperties] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);

  const [globalMessage, setGlobalMessage] = useState("");

  // -----------------------------
  // Fetch Users by Status
  // -----------------------------
  const loadUsers = useCallback(async (statusKey) => {
    setLoadingUsers(true);
    try {
      const data = await fetchJSON(`/api/admin/users?status=${statusKey}`);
      if (statusKey === "pending") setPendingUsers(data.users);
      if (statusKey === "approved") setApprovedUsers(data.users);
      if (statusKey === "rejected") setRejectedUsers(data.users);
    } catch (err) {
      console.error("Admin users fetch error:", err);
      setGlobalMessage(err.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // -----------------------------
  // Fetch Properties
  // -----------------------------
  const loadProperties = useCallback(async () => {
    setLoadingProperties(true);
    try {
      const data = await fetchJSON("/api/admin/properties");
      setProperties(data.properties || []);
    } catch (err) {
      console.error("Admin properties fetch error:", err);
      setGlobalMessage(err.message || "Failed to load properties");
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  // -----------------------------
  // Auth & Initial Data Load
  // -----------------------------
  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "Admin") {
      router.replace("/");
      return;
    }

    // initial load
    loadUsers("pending");
  }, [status, session, router, loadUsers]);

  // -----------------------------
  // Change Section
  // -----------------------------
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setGlobalMessage("");

    if (section === "users-pending") loadUsers("pending");
    if (section === "users-approved") loadUsers("approved");
    if (section === "users-rejected") loadUsers("rejected");
    if (section === "properties") loadProperties();
  };

  // -----------------------------
  // Approve / Reject Handlers
  // -----------------------------
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        setGlobalMessage(data.message || "Approve failed");
        return;
      }

      setPendingUsers((prev) => prev.filter((u) => u._id !== id));
      setGlobalMessage("User approved successfully.");
    } catch (err) {
      console.error("Approve error:", err);
      setGlobalMessage("Approve failed. Try again.");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt(
      "Please enter rejection reason (required):"
    );
    if (!reason || !reason.trim()) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: false, rejectReason: reason }),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        setGlobalMessage(data.message || "Reject failed");
        return;
      }

      setPendingUsers((prev) => prev.filter((u) => u._id !== id));
      setGlobalMessage("User rejected successfully.");
    } catch (err) {
      console.error("Reject error:", err);
      setGlobalMessage("Reject failed. Try again.");
    }
  };

  // Auto-hide global message
  useEffect(() => {
    if (!globalMessage) return;
    const t = setTimeout(() => setGlobalMessage(""), 3000);
    return () => clearTimeout(t);
  }, [globalMessage]);

  if (status === "loading") {
    return <div className="admin-fullscreen-loader">Loading Admin Panel…</div>;
  }

  if (!session || session.user.role !== "Admin") {
    return null;
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">Admin Panel</div>
        <div className="admin-sidebar-section">
          <p className="admin-sidebar-label">Users</p>
          <button
            className={
              activeSection === "users-pending"
                ? "admin-nav-btn active"
                : "admin-nav-btn"
            }
            onClick={() => handleSectionChange("users-pending")}
          >
            Pending Approvals ({pendingUsers.length})
          </button>
          <button
            className={
              activeSection === "users-approved"
                ? "admin-nav-btn active"
                : "admin-nav-btn"
            }
            onClick={() => handleSectionChange("users-approved")}
          >
            Approved Sellers ({approvedUsers.length})
          </button>
          <button
            className={
              activeSection === "users-rejected"
                ? "admin-nav-btn active"
                : "admin-nav-btn"
            }
            onClick={() => handleSectionChange("users-rejected")}
          >
            Rejected Requests ({rejectedUsers.length})
          </button>
        </div>

        <div className="admin-sidebar-section">
          <p className="admin-sidebar-label">Properties</p>
          <button
            className={
              activeSection === "properties"
                ? "admin-nav-btn active"
                : "admin-nav-btn"
            }
            onClick={() => handleSectionChange("properties")}
          >
            All Properties ({properties.length})
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1 className="admin-page-title">Welcome, Admin</h1>
            <p className="admin-page-subtitle">
              Manage users and property listings from this dashboard.
            </p>
          </div>
          <div className="admin-topbar-user">
            <span className="admin-topbar-name">{session.user.email}</span>
            <span className="admin-topbar-role">Role: Admin</span>
          </div>
        </header>

        {globalMessage && (
          <div className="admin-global-message">{globalMessage}</div>
        )}

        <section className="admin-content">
          {activeSection === "users-pending" && (
            <UserTable
              users={pendingUsers}
              loading={loadingUsers}
              onApprove={handleApprove}
              onReject={handleReject}
              emptyText="No pending approvals."
            />
          )}

          {activeSection === "users-approved" && (
            <UserTable
              users={approvedUsers}
              loading={loadingUsers}
              onApprove={null}
              onReject={null}
              emptyText="No approved sellers found."
            />
          )}

          {activeSection === "users-rejected" && (
            <UserTable
              users={rejectedUsers}
              loading={loadingUsers}
              onApprove={null}
              onReject={null}
              emptyText="No rejected requests."
            />
          )}

          {activeSection === "properties" && (
            <PropertyTable
              properties={properties}
              loading={loadingProperties}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
