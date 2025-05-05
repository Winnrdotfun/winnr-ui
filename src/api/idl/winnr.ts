/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/protocol.json`.
 */
export type Protocol = {
  address: "GYwkcJJiUrDnXKYiqMqxfA93h9MejpJbrBHJ73gnfr15";
  metadata: {
    name: "protocol";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "claimTokenDraftContest";
      discriminator: [149, 128, 5, 202, 206, 60, 17, 82];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "config";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "contest";
          writable: true;
        },
        {
          name: "contestMetadata";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  99,
                  111,
                  110,
                  116,
                  101,
                  115,
                  116,
                  95,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ];
              }
            ];
          };
        },
        {
          name: "contestEntry";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  100,
                  114,
                  97,
                  102,
                  116,
                  95,
                  99,
                  111,
                  110,
                  116,
                  101,
                  115,
                  116,
                  95,
                  101,
                  110,
                  116,
                  114,
                  121
                ];
              },
              {
                kind: "account";
                path: "contest";
              },
              {
                kind: "account";
                path: "signer";
              }
            ];
          };
        },
        {
          name: "mint";
          writable: true;
        },
        {
          name: "escrowTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "feeTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  102,
                  101,
                  101,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "signerTokenAccount";
          writable: true;
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "createTokenDraftContest";
      discriminator: [76, 130, 221, 226, 0, 250, 140, 99];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "contestMetadata";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  99,
                  111,
                  110,
                  116,
                  101,
                  115,
                  116,
                  95,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ];
              }
            ];
          };
        },
        {
          name: "contest";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  100,
                  114,
                  97,
                  102,
                  116,
                  95,
                  99,
                  111,
                  110,
                  116,
                  101,
                  115,
                  116
                ];
              },
              {
                kind: "account";
                path: "contest_metadata.token_draft_contest_count";
                account: "contestMetadata";
              },
              {
                kind: "account";
                path: "signer";
              }
            ];
          };
        },
        {
          name: "contestCredits";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  100,
                  114,
                  97,
                  102,
                  116,
                  95,
                  99,
                  111,
                  110,
                  116,
                  101,
                  115,
                  116,
                  95,
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  115
                ];
              },
              {
                kind: "account";
                path: "contest";
              }
            ];
          };
        },
        {
          name: "feed0";
          optional: true;
        },
        {
          name: "feed1";
          optional: true;
        },
        {
          name: "feed2";
          optional: true;
        },
        {
          name: "feed3";
          optional: true;
        },
        {
          name: "feed4";
          optional: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "startTime";
          type: "u64";
        },
        {
          name: "endTime";
          type: "u64";
        },
        {
          name: "entryFee";
          type: "u64";
        },
        {
          name: "maxEntries";
          type: "u32";
        },
        {
          name: "tokenFeedIds";
          type: {
            vec: "pubkey";
          };
        },
        {
          name: "rewardAllocation";
          type: "bytes";
        }
      ];
    },
    {
      name: "enterTokenDraftContest";
      discriminator: [221, 205, 54, 45, 132, 101, 251, 240];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "config";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "contest";
          writable: true;
        },
        {
          name: "contestEntry";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  100,
                  114,
                  97,
                  102,
                  116,
                  95,
                  99,
                  111,
                  110,
                  116,
                  101,
                  115,
                  116,
                  95,
                  101,
                  110,
                  116,
                  114,
                  121
                ];
              },
              {
                kind: "account";
                path: "contest";
              },
              {
                kind: "account";
                path: "signer";
              }
            ];
          };
        },
        {
          name: "contestCredits";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  100,
                  114,
                  97,
                  102,
                  116,
                  95,
                  99,
                  111,
                  110,
                  116,
                  101,
                  115,
                  116,
                  95,
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  115
                ];
              },
              {
                kind: "account";
                path: "contest";
              }
            ];
          };
        },
        {
          name: "mint";
          writable: true;
        },
        {
          name: "escrowTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "signerTokenAccount";
          writable: true;
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "creditAllocation";
          type: "bytes";
        }
      ];
    },
    {
      name: "initialize";
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "config";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "contestMetadata";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  99,
                  111,
                  110,
                  116,
                  101,
                  115,
                  116,
                  95,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ];
              }
            ];
          };
        },
        {
          name: "mint";
        },
        {
          name: "escrowTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "feeTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  102,
                  101,
                  101,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "tokenDraftContestFeePercent";
          type: "u8";
        }
      ];
    },
    {
      name: "resolveTokenDraftContest";
      discriminator: [23, 163, 216, 115, 121, 154, 219, 234];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "contest";
          writable: true;
        },
        {
          name: "contestCredits";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  100,
                  114,
                  97,
                  102,
                  116,
                  95,
                  99,
                  111,
                  110,
                  116,
                  101,
                  115,
                  116,
                  95,
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  115
                ];
              },
              {
                kind: "account";
                path: "contest";
              }
            ];
          };
        },
        {
          name: "contestMetadata";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  99,
                  111,
                  110,
                  116,
                  101,
                  115,
                  116,
                  95,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ];
              }
            ];
          };
        },
        {
          name: "mint";
          writable: true;
        },
        {
          name: "escrowTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "feeTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  102,
                  101,
                  101,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "feed0";
          optional: true;
        },
        {
          name: "feed1";
          optional: true;
        },
        {
          name: "feed2";
          optional: true;
        },
        {
          name: "feed3";
          optional: true;
        },
        {
          name: "feed4";
          optional: true;
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "withdrawFee";
      discriminator: [14, 122, 231, 218, 31, 238, 223, 150];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "config";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "feeTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  102,
                  101,
                  101,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "account";
                path: "config.mint";
                account: "config";
              }
            ];
          };
        },
        {
          name: "withdrawalTokenAccount";
          writable: true;
        },
        {
          name: "mint";
          writable: true;
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "config";
      discriminator: [155, 12, 170, 224, 30, 250, 204, 130];
    },
    {
      name: "contestMetadata";
      discriminator: [107, 161, 153, 84, 148, 80, 205, 226];
    },
    {
      name: "priceUpdateV2";
      discriminator: [34, 241, 35, 99, 157, 126, 244, 205];
    },
    {
      name: "tokenDraftContest";
      discriminator: [182, 132, 128, 196, 47, 224, 170, 206];
    },
    {
      name: "tokenDraftContestCredits";
      discriminator: [146, 13, 226, 54, 217, 58, 206, 91];
    },
    {
      name: "tokenDraftContestEntry";
      discriminator: [141, 253, 77, 126, 92, 161, 222, 153];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidStartTime";
    },
    {
      code: 6001;
      name: "invalidDuration";
    },
    {
      code: 6002;
      name: "contestStillActive";
    },
    {
      code: 6003;
      name: "insufficientAmount";
    },
    {
      code: 6004;
      name: "alreadyClaimed";
    },
    {
      code: 6005;
      name: "invalidDraftTokenCount";
    },
    {
      code: 6006;
      name: "invalidFeeds";
    },
    {
      code: 6007;
      name: "invalidDraftTokenDistribution";
    },
    {
      code: 6008;
      name: "entryClosed";
    },
    {
      code: 6009;
      name: "alreadyFull";
    },
    {
      code: 6010;
      name: "contestNotEnded";
    },
    {
      code: 6011;
      name: "contestNotResolved";
    },
    {
      code: 6012;
      name: "alreadyResolved";
    },
    {
      code: 6013;
      name: "notWinner";
    },
    {
      code: 6014;
      name: "invalidRewardAllocation";
    }
  ];
  types: [
    {
      name: "config";
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            type: "pubkey";
          },
          {
            name: "mint";
            type: "pubkey";
          }
        ];
      };
    },
    {
      name: "contestMetadata";
      type: {
        kind: "struct";
        fields: [
          {
            name: "tokenDraftContestCount";
            type: "u64";
          },
          {
            name: "tokenDraftContestFeePercent";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "priceFeedMessage";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "feedId";
            docs: [
              "`FeedId` but avoid the type alias because of compatibility issues with Anchor's `idl-build` feature."
            ];
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "price";
            type: "i64";
          },
          {
            name: "conf";
            type: "u64";
          },
          {
            name: "exponent";
            type: "i32";
          },
          {
            name: "publishTime";
            docs: ["The timestamp of this price update in seconds"];
            type: "i64";
          },
          {
            name: "prevPublishTime";
            docs: [
              "The timestamp of the previous price update. This field is intended to allow users to",
              "identify the single unique price update for any moment in time:",
              "for any time t, the unique update is the one such that prev_publish_time < t <= publish_time.",
              "",
              "Note that there may not be such an update while we are migrating to the new message-sending logic,",
              "as some price updates on pythnet may not be sent to other chains (because the message-sending",
              "logic may not have triggered). We can solve this problem by making the message-sending mandatory",
              "(which we can do once publishers have migrated over).",
              "",
              "Additionally, this field may be equal to publish_time if the message is sent on a slot where",
              "where the aggregation was unsuccesful. This problem will go away once all publishers have",
              "migrated over to a recent version of pyth-agent."
            ];
            type: "i64";
          },
          {
            name: "emaPrice";
            type: "i64";
          },
          {
            name: "emaConf";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "priceUpdateV2";
      docs: [
        "A price update account. This account is used by the Pyth Receiver program to store a verified price update from a Pyth price feed.",
        "It contains:",
        "- `write_authority`: The write authority for this account. This authority can close this account to reclaim rent or update the account to contain a different price update.",
        "- `verification_level`: The [`VerificationLevel`] of this price update. This represents how many Wormhole guardian signatures have been verified for this price update.",
        "- `price_message`: The actual price update.",
        "- `posted_slot`: The slot at which this price update was posted."
      ];
      type: {
        kind: "struct";
        fields: [
          {
            name: "writeAuthority";
            type: "pubkey";
          },
          {
            name: "verificationLevel";
            type: {
              defined: {
                name: "verificationLevel";
              };
            };
          },
          {
            name: "priceMessage";
            type: {
              defined: {
                name: "priceFeedMessage";
              };
            };
          },
          {
            name: "postedSlot";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "tokenDraftContest";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "creator";
            type: "pubkey";
          },
          {
            name: "startTime";
            type: "u64";
          },
          {
            name: "endTime";
            type: "u64";
          },
          {
            name: "entryFee";
            type: "u64";
          },
          {
            name: "maxEntries";
            type: "u32";
          },
          {
            name: "numEntries";
            type: "u32";
          },
          {
            name: "tokenFeedIds";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "tokenStartPrices";
            type: {
              vec: "f64";
            };
          },
          {
            name: "tokenRois";
            type: {
              vec: "f64";
            };
          },
          {
            name: "winnerIds";
            type: {
              vec: "u32";
            };
          },
          {
            name: "winnerRewardAllocation";
            type: "bytes";
          },
          {
            name: "isResolved";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "tokenDraftContestCredits";
      type: {
        kind: "struct";
        fields: [
          {
            name: "contestKey";
            type: "pubkey";
          },
          {
            name: "creditAllocations";
            type: "bytes";
          }
        ];
      };
    },
    {
      name: "tokenDraftContestEntry";
      type: {
        kind: "struct";
        fields: [
          {
            name: "user";
            type: "pubkey";
          },
          {
            name: "id";
            type: "u32";
          },
          {
            name: "contestKey";
            type: "pubkey";
          },
          {
            name: "creditAllocation";
            type: "bytes";
          },
          {
            name: "hasClaimed";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "verificationLevel";
      docs: [
        "Pyth price updates are bridged to all blockchains via Wormhole.",
        "Using the price updates on another chain requires verifying the signatures of the Wormhole guardians.",
        "The usual process is to check the signatures for two thirds of the total number of guardians, but this can be cumbersome on Solana because of the transaction size limits,",
        "so we also allow for partial verification.",
        "",
        "This enum represents how much a price update has been verified:",
        "- If `Full`, we have verified the signatures for two thirds of the current guardians.",
        "- If `Partial`, only `num_signatures` guardian signatures have been checked.",
        "",
        "# Warning",
        "Using partially verified price updates is dangerous, as it lowers the threshold of guardians that need to collude to produce a malicious price update."
      ];
      type: {
        kind: "enum";
        variants: [
          {
            name: "partial";
            fields: [
              {
                name: "numSignatures";
                type: "u8";
              }
            ];
          },
          {
            name: "full";
          }
        ];
      };
    }
  ];
};
