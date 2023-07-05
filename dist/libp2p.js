"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import 'babel-polyfill'
const libp2p_1 = __importDefault(require("libp2p"));
// @ts-ignore
const libp2p_websockets_1 = __importDefault(require("libp2p-websockets"));
// @ts-ignore
const libp2p_webrtc_star_1 = __importDefault(require("libp2p-webrtc-star"));
const libp2p_noise_1 = require("@chainsafe/libp2p-noise");
// @ts-ignore
const libp2p_mplex_1 = __importDefault(require("libp2p-mplex"));
const libp2p_bootstrap_1 = __importDefault(require("libp2p-bootstrap"));
const libp2p_gossipsub_1 = __importDefault(require("libp2p-gossipsub"));
function p2p({ peerId }) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create our libp2p node
        const libp2p = yield libp2p_1.default.create({
            peerId,
            addresses: {
                // Add the signaling server address, along with our PeerId to our multiaddrs list
                // libp2p will automatically attempt to dial to the signaling server so that it can
                // receive inbound connections from other peers
                listen: [
                    '/dns4/rusty.marcopolo.io/tcp/443/wss/p2p-webrtc-star/',
                    '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
                    '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
                ]
            },
            modules: {
                transport: [libp2p_websockets_1.default, libp2p_webrtc_star_1.default],
                connEncryption: [libp2p_noise_1.NOISE],
                streamMuxer: [libp2p_mplex_1.default],
                peerDiscovery: [libp2p_bootstrap_1.default],
                pubsub: libp2p_gossipsub_1.default
            },
            config: {
                peerDiscovery: {
                    // The `tag` property will be searched when creating the instance of your Peer Discovery service.
                    // The associated object, will be passed to the service when it is instantiated.
                    [libp2p_bootstrap_1.default.tag]: {
                        enabled: true,
                        list: [
                            '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                            '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                            '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
                            '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                            '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
                        ]
                    }
                }
            }
        });
        return libp2p;
    });
}
exports.default = p2p;
