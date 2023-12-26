import Navbar from "@/components/Navbar";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <main className="ml-24">
        {children}
      </main>
    </>
  )
}