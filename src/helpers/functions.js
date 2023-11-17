export const getSearchComboBoxOptions = (options) => {
    return options.map((element)=>{
        return(
            <option key={element} value={element}>{element}</option>
        )
    })
}