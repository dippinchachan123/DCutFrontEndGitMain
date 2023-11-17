export const PRE_PROCESS_TYPES = {
    MARKING_LOTING: "MARKING_LOTING",
    LASER_LOTING: "LASER_LOTING",
    BOIL_LOTING: "BOIL_LOTING",
    GHAT_LOTING: "GHAT_LOTING",
    SHAPE_LOTING: "SHAPE_LOTING",
    POLISH_LOTING: "POLISH_LOTING",
    POLISH_TABLE_LOTING: "POLISH_TABLE_LOTING",
    POLISHED : "POLISHED",
    ORIGINAL_RC : "ORIGINAL_RC",
    RC : "RC",
    REJECTION : "REJECTION"
}

export const POST_PROCESS_TYPES_Keys = {
    MARKING_LOTING: "MARKING_LOTING",
    BOIL_LOTING: "BOIL_LOTING",
    GHAT_LOTING: "GHAT_LOTING",
    SHAPE_LOTING: "SHAPE_LOTING",
    POLISH_TABLE_LOTING: "POLISH_TABLE_LOTING",
    POLISHED : "POLISHED",

}

export const POST_PROCESS_TYPES = {
    MARKING_LOTING: "NATS_PROCESS",
    BOIL_LOTING: "LAL_ACID_PROCESS",
    GHAT_LOTING: "LUSTER_PROCESS",
    SHAPE_LOTING: "PROPONEL_PROCESS",
    POLISH_TABLE_LOTING: "FILLING_PROCESS",
    POLISHED : "POLISHED",

}

export const PROCESS_IDS = {
    ORIGINAL_CUT : "OC",
    MARKING_LOTING: "ML",
    LASER_LOTING: "LL",
    BOIL_LOTING: "BL",
    GHAT_LOTING: "GL",
    SHAPE_LOTING: "SL",
    POLISH_LOTING: "PL",
    POLISH_TABLELOTING: "PLT_",
    POLISHED : "P",
    NATS_PROCESS: "NP",
    LAL_ACIDPROCESS: "LAP",
    LUSTER_PROCESS: "LP",
    PROPONEL_PROCESS: "PP",
    FILLING_PROCESS: "FP"
}

const p = PRE_PROCESS_TYPES

export const weights = {
    [p.LASER_LOTING] : [p.BOIL_LOTING,p.POLISH_LOTING,p.SHAPE_LOTING,p.GHAT_LOTING],
    [p.BOIL_LOTING] : [p.GHAT_LOTING,p.MARKING_LOTING],
    [p.GHAT_LOTING] : [p.BOIL_LOTING,p.LASER_LOTING],
    [p.MARKING_LOTING] : [p.LASER_LOTING,p.BOIL_LOTING,p.POLISH_LOTING,p.SHAPE_LOTING,p.GHAT_LOTING],
    [p.POLISH_LOTING] : [p.BOIL_LOTING],
    [p.POLISH_TABLE_LOTING] : [p.GHAT_LOTING],
    [p.SHAPE_LOTING]  : [p.LASER_LOTING]
}
export const weightsPP = {
    [p.MARKING_LOTING] : [p.BOIL_LOTING ],
    [p.BOIL_LOTING] : [p.GHAT_LOTING],
    [p.GHAT_LOTING] : [p.SHAPE_LOTING],
    [p.SHAPE_LOTING] : [p.POLISH_TABLE_LOTING],
    [p.POLISH_TABLE_LOTING] : [p.POLISHED],
    
}


const getReturnWeightTable = (returnWeights) => {
    const weights = {...returnWeights}
    Object.keys(returnWeights).forEach(key => {
        let weightObj = {}
        weights[key].forEach(element => {
            weightObj[element] = {weight : 0,pieces : 0}
        })
        weights[key] = weightObj
    });
    return weights
}
export const returnWeights = getReturnWeightTable(weights)
export const returnWeightsPP = getReturnWeightTable(weightsPP)


