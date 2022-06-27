import Grid from "@mui/material/Grid";
import ItemCard from "../../Cards/ProductCard";
// types
import { Items } from "../../../apollo/items";

interface OrderDetails extends Items {
  quantity: number
}

type ItemsListProps = {
    selected?: OrderDetails[];
    items: Items[];
    handleSelect?: (item: Items) => void;
}

function ItemsList({ items, handleSelect, selected }: ItemsListProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 5 }}>
        {items.map(item => (
            <Grid item key={item.itemCode} xs={12} sm={6} md={4}>
                <ItemCard 
                  product={item} 
                  handleSelect={handleSelect ? () => handleSelect(item) : undefined} 
                  selected={selected && selected.find(i => i.itemCode === item.itemCode) !== undefined}  
                />
            </Grid>
        ))}
    </Grid>
  )
}

export default ItemsList