def call(Map parameters) {
    //access stage name
    echo "Start - Extension for stage: ${params.stageName}"
    
    //skip execution of original stage as defined in the template
    //params.originalStage()
    echo "Skip ${params.stageName}"
}
return this