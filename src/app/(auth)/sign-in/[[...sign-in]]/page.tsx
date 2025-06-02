import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center">
      <SignIn />
    </div>
  )
}
