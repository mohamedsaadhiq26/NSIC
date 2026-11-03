import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import UploadModal from '../components/UploadModal';
import { api, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Package, Flag, CheckCircle2, Trash2, RefreshCw, Loader2, Plus, XCircle, Check } from 'lucide-react';

export default function AdminModule() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('claims'); // 'claims' | 'items' | 'users'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Upload Modal State (Admin Exclusive)
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const showNotification = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes, itemsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminItems(),
      ]);
      setStats(statsRes.stats);
      setUsers(usersRes.users || []);
      setItems(itemsRes.items || []);
    } catch (err) {
      setError(err.message || 'FAILED TO FETCH ADMIN DATA');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteItem = async (itemId, title) => {
    if (!window.confirm(`PERMANENTLY PURGE "${title.toUpperCase()}" FROM CAMPUS ARCHIVE?`)) return;
    try {
      await api.deleteItem(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      showNotification(`ITEM "${title.toUpperCase()}" PERMANENTLY REMOVED.`);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'FAILED TO DELETE');
    }
  };

  const handleToggleFlag = async (itemId, currentFlag) => {
    try {
      await api.toggleAdminItemFlag(itemId, !currentFlag);
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, isFlagged: !currentFlag } : i))
      );
      showNotification(!currentFlag ? 'ITEM FLAGGED AS SPAM.' : 'SPAM FLAG REMOVED.');
    } catch (err) {
      alert(err.message || 'FAILED TO FLAG');
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await api.updateAdminUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      showNotification(`USER ROLE UPDATED TO ${newRole}`);
    } catch (err) {
      alert(err.message || 'FAILED TO UPDATE ROLE');
    }
  };

  // Exclusive Admin Claim Adjudication (Approve or Reject)
  const handleClaimAdjudication = async (claimId, newStatus) => {
    try {
      await api.updateClaimStatus(claimId, newStatus);
      showNotification(`CLAIM MARKED AS ${newStatus.toUpperCase()}!`);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'FAILED TO UPDATE CLAIM');
    }
  };

  const handleItemCreated = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
    showNotification(`NEW ITEM "${newItem.title.toUpperCase()}" POSTED BY ADMIN!`);
    loadAdminData();
  };

  // Compile all claims across all items
  const allClaims = items.flatMap((item) =>
    (item.claims || []).map((c) => ({
      ...c,
      itemTitle: item.title,
      itemCategory: item.category,
      itemLocation: item.location,
      itemStatus: item.status,
    }))
  );

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col font-sans text-black selection:bg-[#FFE600] selection:text-black">
      {/* Navbar with exclusive upload modal button */}
      <Navbar onOpenUpload={() => setIsUploadOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
        {actionMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center space-x-2.5 px-5 py-3.5 bg-[#FFE600] text-black border-2 border-black shadow-[6px_6px_0px_0px_#000] font-mono font-black text-xs uppercase">
              <CheckCircle2 className="w-4 h-4 stroke-[3] text-black shrink-0" />
              <span>{actionMessage}</span>
            </div>
          </div>
        )}

        {/* Master Admin Header Banner */}
        <div className="mb-8 bg-[#FF48B0] border-2 sm:border-[3px] border-black shadow-[6px_6px_0px_0px_#000] sm:shadow-[10px_10px_0px_0px_#000] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-black text-[#FF48B0] px-3 py-1 font-mono font-black text-xs uppercase border border-black shadow-[2px_2px_0px_0px_#000]">
              <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
              <span>ADMINISTRATOR MASTER COMMAND CONSOLE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tighter text-black leading-tight">
              MASTER ARCHIVE CONTROLLER
            </h1>
            <p className="font-mono text-xs sm:text-sm text-black font-bold uppercase max-w-2xl bg-white p-2.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              EXCLUSIVE POWERS: INTAKE POSTS, DELETE CORRUPT/SPAM RECORDS, AND ADJUDICATE STUDENT CLAIMS (APPROVE / REJECT).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Exclusive Upload Item Button */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-5 py-3 bg-[#FFE600] hover:bg-black hover:text-white text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>POST NEW FOUND ITEM</span>
            </button>

            <button
              onClick={loadAdminData}
              disabled={loading}
              className="px-4 py-3 bg-white hover:bg-black hover:text-white text-black font-mono font-bold text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 stroke-[3] ${loading ? 'animate-spin' : ''}`} />
              <span>SYNC</span>
            </button>
          </div>
        </div>

        {/* System Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 sm:p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
            <div className="font-mono font-black text-xs uppercase text-black/60 mb-1 flex items-center justify-between">
              <span>REGISTERED</span>
              <Users className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="font-display font-black text-3xl text-black">{stats?.totalUsers ?? '...'}</div>
            <div className="font-mono text-[10px] uppercase font-bold text-black/50 mt-1">VERIFIED .EDU ACCOUNTS</div>
          </div>

          <div className="p-4 sm:p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
            <div className="font-mono font-black text-xs uppercase text-black/60 mb-1 flex items-center justify-between">
              <span>TOTAL ITEMS</span>
              <Package className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="font-display font-black text-3xl text-black">{stats?.totalItems ?? '...'}</div>
            <div className="font-mono text-[10px] uppercase font-bold text-[#FF5C00] mt-1">
              {stats?.activeItems ?? 0} ACTIVE IN FEED
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#FF5C00] border-2 border-black shadow-[4px_4px_0px_0px_#000]">
            <div className="font-mono font-black text-xs uppercase text-black mb-1 flex items-center justify-between">
              <span>PENDING CLAIMS</span>
              <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="font-display font-black text-3xl text-black">{stats?.pendingClaims ?? '0'}</div>
            <div className="font-mono text-[10px] uppercase font-black text-black mt-1">AWAITING ADJUDICATION</div>
          </div>

          <div className="p-4 sm:p-5 bg-[#FFE600] border-2 border-black shadow-[4px_4px_0px_0px_#000]">
            <div className="font-mono font-black text-xs uppercase text-black mb-1 flex items-center justify-between">
              <span>RESOLVED</span>
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="font-display font-black text-3xl text-black">
              {items.filter((i) => i.status === 'resolved').length}
            </div>
            <div className="font-mono text-[10px] uppercase font-bold text-black mt-1">RETURNED TO STUDENTS</div>
          </div>
        </div>

        {/* Harsh Rectangular Navigation Tabs */}
        <div className="flex items-center flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('claims')}
            className={`font-mono font-black text-xs uppercase tracking-wider px-4 py-2.5 border-2 border-black transition-all ${
              activeTab === 'claims'
                ? 'bg-black text-white shadow-[3px_3px_0px_0px_#FFE600] -translate-x-0.5 -translate-y-0.5'
                : 'bg-white hover:bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            CLAIM ADJUDICATION CENTER ({allClaims.length})
          </button>

          <button
            onClick={() => setActiveTab('items')}
            className={`font-mono font-black text-xs uppercase tracking-wider px-4 py-2.5 border-2 border-black transition-all ${
              activeTab === 'items'
                ? 'bg-black text-white shadow-[3px_3px_0px_0px_#FFE600] -translate-x-0.5 -translate-y-0.5'
                : 'bg-white hover:bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            ALL ITEMS & MASTER PURGE ({items.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`font-mono font-black text-xs uppercase tracking-wider px-4 py-2.5 border-2 border-black transition-all ${
              activeTab === 'users'
                ? 'bg-black text-white shadow-[3px_3px_0px_0px_#FFE600] -translate-x-0.5 -translate-y-0.5'
                : 'bg-white hover:bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            CAMPUS USERS DIRECTORY ({users.length})
          </button>
        </div>

        {/* TAB 1: CLAIM ADJUDICATION (APPROVE / REJECT) */}
        {activeTab === 'claims' && (
          <div className="bg-white border-2 sm:border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
            <div className="p-5 border-b-2 border-black bg-[#00F0FF] flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-xl uppercase tracking-tight text-black">
                  OFFICIAL STUDENT CLAIM ADJUDICATION CONSOLE
                </h3>
                <p className="font-mono text-xs text-black font-bold uppercase mt-0.5">
                  EXCLUSIVE ADMIN CONTROLS: REVIEW STUDENT CREDENTIALS AND EXECUTE APPROVAL OR REJECTION
                </p>
              </div>
            </div>

            {allClaims.length === 0 ? (
              <div className="p-12 text-center font-mono font-bold text-xs text-black/60 uppercase">
                NO CLAIMS SUBMITTED YET.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#E5E5DF] border-b-2 border-black text-black uppercase font-black tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">CLAIMED ITEM</th>
                      <th className="py-3.5 px-4">STUDENT NAME</th>
                      <th className="py-3.5 px-4">REGISTRATION NUMBER</th>
                      <th className="py-3.5 px-4">DEPARTMENT</th>
                      <th className="py-3.5 px-4">STATUS</th>
                      <th className="py-3.5 px-6 text-right">ADMIN ADJUDICATION CONTROLS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black text-black">
                    {allClaims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-[#FFE600]/20 transition-colors">
                        <td className="py-4 px-6 font-display font-black text-sm uppercase text-black">
                          {claim.itemTitle}
                          <div className="font-mono text-[10px] text-black/60 normal-case mt-0.5">
                            {claim.itemLocation} • {claim.itemCategory}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-black uppercase">
                          {claim.studentName || claim.claimer?.name || 'STUDENT'}
                          <div className="text-[10px] text-black/50 font-normal">{claim.claimer?.email}</div>
                        </td>
                        <td className="py-4 px-4 font-black bg-[#FFE600]/50 border-l border-r border-black">
                          {claim.registrationNumber}
                        </td>
                        <td className="py-4 px-4 font-bold uppercase">
                          {claim.department}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 border border-black font-black uppercase text-[10px] ${
                              claim.status === 'approved'
                                ? 'bg-[#00FF66] text-black'
                                : claim.status === 'rejected'
                                ? 'bg-[#FF48B0] text-black'
                                : 'bg-[#FF5C00] text-black'
                            }`}
                          >
                            {claim.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          {claim.status !== 'approved' && (
                            <button
                              onClick={() => handleClaimAdjudication(claim.id, 'approved')}
                              className="px-3 py-1.5 bg-[#00FF66] hover:bg-black hover:text-white text-black font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>APPROVE</span>
                            </button>
                          )}
                          {claim.status !== 'rejected' && (
                            <button
                              onClick={() => handleClaimAdjudication(claim.id, 'rejected')}
                              className="px-3 py-1.5 bg-[#FF48B0] hover:bg-black hover:text-white text-black font-display font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>REJECT</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL ITEMS & MASTER DELETE */}
        {activeTab === 'items' && (
          <div className="bg-white border-2 sm:border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
            <div className="p-5 border-b-2 border-black bg-[#F4F4F0] flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-xl uppercase tracking-tight text-black">
                  MASTER ITEM REPOSITORY // PURGE CONTROL
                </h3>
                <p className="font-mono text-xs text-black/70 uppercase">
                  ADMINISTRATIVE OVERVIEW OF ALL POSTED ITEMS IN THE SYSTEM
                </p>
              </div>

              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 bg-[#FFE600] hover:bg-black hover:text-white text-black font-mono font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>POST ITEM</span>
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center font-mono font-black text-xs text-black uppercase">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-black mb-2 stroke-[3]" />
                SYNCING REPOSITORY...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#E5E5DF] border-b-2 border-black text-black uppercase font-black tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">ITEM DESCRIPTION</th>
                      <th className="py-3.5 px-4">LOCATION</th>
                      <th className="py-3.5 px-4">CATEGORY</th>
                      <th className="py-3.5 px-4">STATUS</th>
                      <th className="py-3.5 px-4">CLAIMS</th>
                      <th className="py-3.5 px-6 text-right">MASTER ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black text-black">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FFE600]/20 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={getImageUrl(item.imageUrl)}
                              alt={item.title}
                              className="w-12 h-12 object-cover border-2 border-black shrink-0"
                            />
                            <div>
                              <div className="font-display font-black text-sm uppercase text-black">
                                {item.title}
                              </div>
                              <span className="font-mono text-[10px] text-black/60 uppercase">
                                POSTED BY {item.finder?.name?.toUpperCase() || 'ADMIN'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold uppercase">{item.location}</td>
                        <td className="py-3.5 px-4 font-bold uppercase">{item.category}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 border border-black font-black uppercase text-[10px] ${
                              item.status === 'available'
                                ? 'bg-[#00FF66] text-black'
                                : item.status === 'pending'
                                ? 'bg-[#FF5C00] text-black'
                                : 'bg-black text-white'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-black">
                          {item.claims?.length || 0} FILED
                        </td>
                        <td className="py-3.5 px-6 text-right space-x-2 whitespace-nowrap">
                          {/* Master DELETE ITEM button */}
                          <button
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            className="px-3 py-1.5 bg-[#FF48B0] hover:bg-black hover:text-white text-black font-mono font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>DELETE ITEM</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REGISTERED USERS */}
        {activeTab === 'users' && (
          <div className="bg-white border-2 sm:border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
            <div className="p-5 border-b-2 border-black bg-[#F4F4F0]">
              <h3 className="font-display font-black text-lg uppercase tracking-tight text-black">
                CAMPUS USER DIRECTORY (STUDENT & ADMIN)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#E5E5DF] border-b-2 border-black text-black uppercase font-black tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">USER NAME</th>
                    <th className="py-3.5 px-4">CAMPUS EMAIL</th>
                    <th className="py-3.5 px-4">CURRENT ROLE</th>
                    <th className="py-3.5 px-4">STUDENT ID</th>
                    <th className="py-3.5 px-6 text-right">ROLE OVERRIDE</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black text-black">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FFE600]/20 transition-colors">
                      <td className="py-4 px-6 font-display font-black text-sm uppercase text-black">{u.name}</td>
                      <td className="py-4 px-4 font-bold">{u.email}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 border border-black font-black uppercase text-[10px] ${
                            u.role === 'ADMIN' ? 'bg-[#FF48B0] text-black' : 'bg-[#CCFF00] text-black'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold">{u.studentId || '—'}</td>
                      <td className="py-4 px-6 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                          className="px-2.5 py-1 text-xs border-2 border-black bg-white font-mono font-black uppercase shadow-[2px_2px_0px_0px_#000] outline-none"
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Admin Exclusive Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onItemCreated={handleItemCreated}
      />
    </div>
  );
}
