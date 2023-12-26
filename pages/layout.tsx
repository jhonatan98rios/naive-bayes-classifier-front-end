import Footer from "@/components/Navbar";
import Navbar from "@/components/Navbar";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  )
}