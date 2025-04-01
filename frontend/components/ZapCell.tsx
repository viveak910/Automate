export const ZapCell=({name , index , onClick}:{
    name : string,
    index : number, 
    onClick?: () => void;

})=>{
    return (
        <div onClick={onClick} className="border border-black py-8 px-8 flex w-[300px] justify-center cursoer-pointer">
            <div className="flex text-xl">
                {index },
            </div>
            <div className="flex text-xl">
                {name}
            </div>
        </div>
    )


}