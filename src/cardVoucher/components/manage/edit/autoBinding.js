export default function autoBinding(attr, aa, bb, desc) {
    const oldFunc = desc.value

    desc.value = function() {
        const ret = oldFunc.bind(this)(...arguments)
        return this.props[attr](ret)
    }

    return desc
}
