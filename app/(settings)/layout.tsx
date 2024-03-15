import { Navbar } from './_components/navbar'

type ProtectedLayoutProps = {
  children: React.ReactNode
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-8 items-center pt-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <Navbar />
      {children}
    </div>
  )
}

export default ProtectedLayout
