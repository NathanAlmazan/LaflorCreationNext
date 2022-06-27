import { AnimatePresence, motion } from "framer-motion";
import { Items } from "../../../apollo/items";
import AddonCard from "../../Cards/AddonCard";

interface OrderDetails extends Items {
    quantity: number
}

type ItemListProps =  { 
    selected: OrderDetails[],
    remove: (code: string) => void,
    update: (code: string, quantity: number) => void 
}

function AddonList({ selected, remove, update }: ItemListProps) {
  return (
    <AnimatePresence>
    {selected.map((item) => (
        <motion.div
        key={item.itemCode}
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 200, opacity: 0 }}
        style={{ margin: 10 }}
        >
        <AddonCard product={item} 
            update={update} 
            remove={() => remove(item.itemCode)} />
        </motion.div>
    ))}
    </AnimatePresence>
  )
}

export default AddonList