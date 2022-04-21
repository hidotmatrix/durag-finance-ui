// SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Socks.sol";

/** title Contract Unisocks inherits functionality of ERC721 and Ownable contracts */
contract Unisocks is ERC721,Ownable {

    uint256 public totalSupply;

    address public socksAddress;

    string public baseTokenURI;

    /// mapping from owner's index to tokenId
    mapping(address => mapping(uint256 => uint256)) public ownerIndexToTokenId;

    /// mapping from tokenId to index
    mapping(uint256 => uint256) public tokenIdToIndex;

    /// event for logging change in the base token uri
    event URI(string uri);

    /// Initialize an instance of socks contract
    Socks socks;

    constructor(
        address _socks,
        string memory _baseTokenURI
    ) ERC721("Unisocks","SOCKS") {
        socksAddress = _socks;
        baseTokenURI = _baseTokenURI;
    }

    /**
    * @dev owner mint NFT's equivalent to the burn tokens at socks contract
    * @param _to mint address
    * @param _amount amount of NFT's to be minted
    */
    function mint(address _to,uint256 _amount) external onlyOwner {
        socks = Socks(socksAddress);
        uint256 _socksSupply = socks.totalSupply();
        uint256 _socksBurned = socks.supply() - _socksSupply;
        require((totalSupply*10**18) < _socksBurned,"mint: tokenSupply exceeds burned limit");
        
        for(uint256 token = 0; token < _amount; token++) {
            uint256 index = balanceOf(_to);
            totalSupply += 1;
            _mint(_to,totalSupply);
            ownerIndexToTokenId[_to][index] = totalSupply;
            tokenIdToIndex[totalSupply] = index;
        }
    }

    /**
    * @dev owner can change the uri
    * @param _uri new uri value
    */
    function setURI(string memory _uri) external onlyOwner {
        baseTokenURI = _uri;
        emit URI(_uri);
    }

    /**
    * @dev override function,and implement functionalities to transfer NFT from one user to another
    * @param _from sender's address
    * @param _to receiver's address
    * @param _tokenId NFT to be transfered
    */
    function _afterTokenTransfer(address _from, address _to, uint256 _tokenId) internal override {
        if(_from != address(0)) {
            uint256 _highestIndexFrom = balanceOf(_from);
            uint256 _tokenIdIndexFrom = tokenIdToIndex[_tokenId];

            if(_highestIndexFrom == _tokenIdIndexFrom) {
                ownerIndexToTokenId[_from][_highestIndexFrom] = 0;
            }
            else {
                ownerIndexToTokenId[_from][_tokenIdIndexFrom] = ownerIndexToTokenId[_from][_highestIndexFrom];
                ownerIndexToTokenId[_from][_highestIndexFrom] = 0;
            }

            uint256 _newHighestIndexTo = balanceOf(_to)-1;
            ownerIndexToTokenId[_to][_newHighestIndexTo] = _tokenId;
            tokenIdToIndex[_tokenId] = _newHighestIndexTo;
        } 
    }
    
    /**
    * @dev baseURI
    * @return baseTokenURI
    */
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

}