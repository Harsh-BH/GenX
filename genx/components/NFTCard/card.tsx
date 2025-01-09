import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type Props = {
    imageUrl: string,
    title: string,
    recipientAddress: string
}

const NFTCard = ({imageUrl,title,recipientAddress} : Props) => {
    return ( 
        <Card className="max-w-[300px]">
            <CardContent className="flex flex-col items-center justify-center p-4">
            <img className="rounded-lg w-40 h-40" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8JasfPOujOCnkLNm5DEpsUoXLWPrZL26KxQ&s"/>
            <span className="text-md font-semibold mt-2">{title}</span>
            <span className="text-xs">{recipientAddress} ETH</span>
            <Button className="font-semibold w-full mt-3">Check Out</Button>
            </CardContent>
        </Card>
     );
}
 
export default NFTCard;