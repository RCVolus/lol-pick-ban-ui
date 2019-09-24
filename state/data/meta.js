class Meta {
    constructor(
        cdn,
        version = {}
    ) {
        this.version = version;
        this.cdn = cdn;
    }
}

export default Meta;