const Administration = artifacts.require("Administration");
const PaperCommentLib = artifacts.require("PaperCommentLib");
const ConversionLib = artifacts.require("ConversionLib");
const ConferenceLib = artifacts.require("ConferenceLib");
const ProposalLib = artifacts.require("ProposalLib");
const TokenLib = artifacts.require("TokenLib");


module.exports = function (deployer) {
    deployer.deploy(PaperCommentLib);
    deployer.link(PaperCommentLib, ConferenceLib);
    deployer.deploy(ConversionLib);
    deployer.link(ConversionLib, TokenLib);
    deployer.deploy(ConferenceLib);
    deployer.link(ConferenceLib, Administration);
    deployer.deploy(ProposalLib);
    deployer.link(ProposalLib, Administration);
    deployer.deploy(TokenLib);
    deployer.link(TokenLib, Administration);
    deployer.deploy(Administration);
};