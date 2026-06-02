import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f7f8f8]">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}