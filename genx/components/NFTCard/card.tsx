import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type Props = {
    imageUrl: string,
    title: string,
    price: string
}

const NFTCard = ({imageUrl,title,price} : Props) => {
    return ( 
        <Card className="max-w-[300px]">
            <CardContent className="flex flex-col items-center justify-center p-4">
            <img className="rounded-lg w-40 h-40" src={imageUrl}/>
            <span className="text-md font-semibold mt-2">{title}</span>
            <span className="text-xs">{price} ETH</span>
            <Button className="font-semibold w-full mt-3">Check Out</Button>
            </CardContent>
        </Card>
     );
}
 
export default NFTCard;