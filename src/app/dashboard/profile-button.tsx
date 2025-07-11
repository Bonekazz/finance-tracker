import { IOSDrawer, IOSDrawerContent, IOSDrawerTrigger } from "@/components/ui/ios-drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";


export function ProfileButton({ imageUrl }: { imageUrl?: string }) {
  return (
    <IOSDrawer>
      <IOSDrawerTrigger>
        <Button className="border-none w-[44px] h-[44px] rounded-full overflow-hidden p-0">
          { imageUrl ? <img src={imageUrl} className="object-cover" /> : <Skeleton className="w-full h-full" /> }
        </Button>
      </IOSDrawerTrigger>
      <IOSDrawerContent>
        <div className="w-full">Página de perfil em desenvolvimento</div>
      </IOSDrawerContent>
    </IOSDrawer>
  )
}
