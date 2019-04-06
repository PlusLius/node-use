module.exports = {
    add(...args){
        return args.reduce((total,next) => (
            total + next
        ))
    },
    mul(...args){
        return args.reduce((total,next) => (
            total * next
        ))
    }
}