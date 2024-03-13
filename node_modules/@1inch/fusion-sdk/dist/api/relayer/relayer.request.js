"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelayerRequest = void 0;
class RelayerRequest {
    constructor(params) {
        this.order = params.order;
        this.signature = params.signature;
        this.quoteId = params.quoteId;
    }
    static new(params) {
        return new RelayerRequest(params);
    }
    build() {
        return {
            order: this.order,
            signature: this.signature,
            quoteId: this.quoteId
        };
    }
}
exports.RelayerRequest = RelayerRequest;
//# sourceMappingURL=relayer.request.js.map