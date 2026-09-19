import purchasedPackFees from "../../../../../models/deswapPack/purchasingFees";
import purchasedPack from "../../../../../models/deswapPack/purchasedpack";
import PackClaimmedSchema from "../../../../../models/claimmedrewards/packclaimmed";
import NetworkClaimmed from "../../../../../models/claimmedrewards/networkclaimmed";

const handler = async(req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        //search in clammingpackid in claimmingpack 
        const packClaimmed_ = await PackClaimmedSchema.findOne({
            packid: req.body.packid
        });
        if (packClaimmed) {
            res.status(400).json({ data: null, error: "Pack is in use" });
            return;
        }
        //search in clammingpackid in networkclaimmed
        const networkClaimmed_ = await NetworkClaimmed.findOne({
            packid: req.body.packid
        });
        if (networkClaimmed) {
            res.status(400).json({ data: null, error: "Pack is in use" });
            return;
        }
        //search in packid in purchasedpack
        const purchasedPack_ = await purchasedPack.findOne({
            packid: req.body.packid
        });
        if (purchasedPack) {
            res.status(400).json({ data: null, error: "Pack is in use" });
            return;
        }
        //search in packid in purchasedpack
        const purchasedPackFees_ = await purchasedPackFees.findOne({
            packid: req.body.packid
        });
        if (purchasedPackFees) {
            res.status(400).json({ data: null, error: "Pack is in use" });
            return;
        }
    } catch (error) {
        res.status(400).json({ data: null, error: error.message });
    }
}