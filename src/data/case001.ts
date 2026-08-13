const case001Data = {
  "TEXT_ROUNDS": [
    {
      "id": 0,
      "difficulty": "Tutorial",
      "badgeColor": "bg-[#0F172A]/10 text-[#0F172A] border-[#0F172A]",
      "title": "Community Relief Goods",
      "postAuthor": "Concerned Citizen",
      "postHandle": "@truthseeker99",
      "postTime": "2 hrs ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 1,
      "tacticOptions": [
        "Vague Attribution",
        "Artificial Urgency",
        "Phishing Link",
        "False Context"
      ],
      "segments": [
        {
          "id": "t-1",
          "text": "ALERT! Our city council is giving out FAKE relief goods to flood victims! "
        },
        {
          "id": "t-2",
          "text": "An unnamed city official stated that the distributed items were 'expired and unsafe for consumption.' ",
          "isClue": true,
          "explanation": "Vague attribution: Which official? Real alerts name the source.",
          "tactic": "Vague Attribution"
        },
        {
          "id": "t-3",
          "text": "Share this now before more people get hurt!"
        }
      ],
      "verifiedSources": [
        {
          "name": "Official City Council Page",
          "text": "\"No relief goods have been distributed yet. Distribution starts tomorrow.\""
        },
        {
          "name": "Local News",
          "text": "No reports of expired goods in this area."
        }
      ]
    },
    {
      "id": 1,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Scam Scholarship Post",
      "postAuthor": "University Admissions Update",
      "postHandle": "@UniScholarshipsPh",
      "postTime": "4 hrs ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 1,
      "tacticOptions": [
        "Advance Fee Fraud",
        "Unofficial Domain",
        "Vague Attribution",
        "Fabricated Quote"
      ],
      "segments": [
        {
          "id": "1-1",
          "text": "ALERT! National State University is opening 50 FREE scholarship slots for incoming students! ",
          "isDecoy": true,
          "explanation": "The university name is real, but scammers often use real institutions to build trust."
        },
        {
          "id": "1-2",
          "text": "To secure your slot, applicants must first send a $50 'processing fee' to CashApp tag $UniScholarships. ",
          "isClue": true,
          "explanation": "Real scholarships never ask for a processing fee via personal mobile wallets.",
          "tactic": "Advance Fee Fraud"
        },
        {
          "id": "1-3",
          "text": "Please complete your application early as slots are limited. "
        },
        {
          "id": "1-4",
          "text": "PM us your receipt. No official website link available at the moment."
        }
      ],
      "verifiedSources": [
        {
          "name": "Official University Website",
          "text": "\"We do not ask for CashApp processing fees. All scholarship applications are processed through our official portal.\""
        },
        {
          "name": "Scam Alert Database",
          "text": "CashApp tag $UniScholarships has been flagged multiple times for 'Advance Fee' fraud."
        }
      ]
    },
    {
      "id": 2,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Celebrity Endorsement",
      "postAuthor": "Health & Wellness Daily",
      "postHandle": "@HealthyLifePh",
      "postTime": "12 hrs ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 1,
      "tacticOptions": [
        "Fabricated Quote",
        "Suspicious Storefront",
        "Artificial Urgency",
        "Emotional Manipulation"
      ],
      "segments": [
        {
          "id": "2-1",
          "text": "Have you tried this new miracle cure? "
        },
        {
          "id": "2-2",
          "text": "Even a famous actor swears by it! ",
          "isDecoy": true,
          "explanation": "The celebrity's name is correctly used, but their endorsement is entirely fabricated."
        },
        {
          "id": "2-3",
          "text": "\"I was struggling with high blood sugar until I found GlucoCure Max. It completely reversed my diabetes in 2 weeks!\" ",
          "isClue": true,
          "explanation": "The quote is entirely fabricated and doesn't appear on any of his official channels.",
          "tactic": "Fabricated Quote"
        },
        {
          "id": "2-4",
          "text": "This herbal supplement is popular right now. "
        },
        {
          "id": "2-5",
          "text": "Buy it now exclusively at this unverified Shopify link: buy-gluco-max-now.shop.co"
        }
      ],
      "verifiedSources": [
        {
          "name": "Celebrity Official Page",
          "text": "\"I am not endorsing any diabetes supplement. Please beware of fake ads using my name.\""
        },
        {
          "name": "National Health Database",
          "text": "0 results found for \"GlucoCure Max\". Not a registered food or drug product."
        }
      ]
    },
    {
      "id": 3,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Official Advisory",
      "postAuthor": "Regional Gov Updates",
      "postHandle": "@RegionalGov_Updates",
      "postTime": "1 hr ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 1,
      "tacticOptions": [
        "Unverified Claim",
        "Advance Fee Fraud",
        "Fabricated Quote",
        "Artificial Urgency"
      ],
      "segments": [
        {
          "id": "3-1",
          "text": "Due to the incoming Super Typhoon, ",
          "isDecoy": true,
          "explanation": "The typhoon itself is a real, ongoing weather event. Flagging the typhoon is wrong, only the suspension claim is fake."
        },
        {
          "id": "3-2",
          "text": "all classes (all levels) and government work in the region are SUSPENDED tomorrow. ",
          "isClue": true,
          "explanation": "No matching post exists on the official government social media account.",
          "tactic": "Unverified Claim"
        },
        {
          "id": "3-3",
          "text": "Please share this to everyone in our community! "
        },
        {
          "id": "3-4",
          "text": "Stay safe and stay indoors! Share to inform others."
        }
      ],
      "verifiedSources": [
        {
          "name": "Official Gov PIO Page",
          "text": "\"No suspension of classes has been announced yet. We are monitoring the weather.\""
        },
        {
          "name": "Memo Database",
          "text": "Memo No. 45-B was issued last year for a completely different event."
        }
      ]
    },
    {
      "id": 4,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Job Offer",
      "postAuthor": "HR Recruitment PH",
      "postHandle": "@JobsPH_Official",
      "postTime": "30 mins ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 1,
      "tacticOptions": [
        "Advance Fee Fraud",
        "Too Good to Be True",
        "Phishing Link",
        "Impersonation"
      ],
      "segments": [
        {
          "id": "4-1",
          "text": "WORK FROM HOME: Earn $500 to $1,000 daily by just watching YouTube videos! "
        },
        {
          "id": "4-2",
          "text": "We are hiring 100 people today for immediate start. No experience needed! ",
          "isDecoy": true,
          "explanation": "While 'no experience needed' is common, the ridiculous pay rate for watching videos is the real red flag."
        },
        {
          "id": "4-3",
          "text": "To get your starting kit and portal access, pay the $25 training fee via CashApp. ",
          "isClue": true,
          "explanation": "Legitimate employers will never ask you to pay a fee to start working.",
          "tactic": "Advance Fee Fraud"
        },
        {
          "id": "4-4",
          "text": "DM us your resume to apply! "
        }
      ],
      "verifiedSources": [
        {
          "name": "Labor Dept Advisory",
          "text": "\"Beware of online job offers asking for training fees or equipment fees. This is a common scam.\""
        },
        {
          "name": "Scam Alert",
          "text": "Shortened links in job offers are highly suspicious and often lead to phishing sites."
        }
      ]
    },
    {
      "id": 5,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Bank Alert",
      "postAuthor": "Security Alerts",
      "postHandle": "@GlobalBank_Security",
      "postTime": "Just now",
      "correctVerdict": "Fake",
      "cluesNeeded": 1,
      "tacticOptions": [
        "Impersonation",
        "Phishing Link",
        "Vague Attribution",
        "Too Good to Be True"
      ],
      "segments": [
        {
          "id": "5-1",
          "text": "SECURITY ALERT for all Global Bank Account Holders. "
        },
        {
          "id": "5-2",
          "text": "Your account has been temporarily locked due to suspicious login attempts from overseas. ",
          "isDecoy": true,
          "explanation": "Banks do lock accounts for suspicious activity, but the method of notification here is fake."
        },
        {
          "id": "5-3",
          "text": "Please update your security settings. "
        },
        {
          "id": "5-4",
          "text": "Click here to unlock your account: www.globalbank-security-unlock.com",
          "isClue": true,
          "explanation": "This is a fake domain. Official Global Bank alerts direct you to the official app or globalbank.com.",
          "tactic": "Phishing Link"
        }
      ],
      "verifiedSources": [
        {
          "name": "Official Bank Advisory",
          "text": "\"We will never ask you to click a link to unlock your account or verify your identity.\""
        },
        {
          "name": "Domain Check",
          "text": "'globalbank-security-unlock.com' was registered 2 days ago."
        }
      ]
    },
    {
      "id": 6,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Giveaway",
      "postAuthor": "MrBeast Giveaways",
      "postHandle": "@MrBeast_Global_Giveaways",
      "postTime": "5 hrs ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Advance Fee Fraud",
        "Impersonation",
        "Phishing Link",
        "Artificial Urgency"
      ],
      "segments": [
        {
          "id": "6-1",
          "text": "I am giving away $10,000 to the first 500 people who share this post! "
        },
        {
          "id": "6-2",
          "text": "Congratulations to our previous winners who already received their cash! ",
          "isDecoy": true,
          "explanation": "Scammers often use fake testimonials or fake previous winners to build trust."
        },
        {
          "id": "6-3",
          "text": "Message our admin 'Jimmy' directly to claim your prize. ",
          "isClue": true,
          "explanation": "Real giveaways do not require you to message a random admin account.",
          "tactic": "Impersonation"
        },
        {
          "id": "6-4",
          "text": "Winners must pay a small $30 transfer fee to receive the $10,000. ",
          "isClue": true,
          "explanation": "A legitimate giveaway will never ask the winner to pay a fee to receive their prize.",
          "tactic": "Advance Fee Fraud"
        }
      ],
      "verifiedSources": [
        {
          "name": "MrBeast Official",
          "text": "\"I do not have a separate regional giveaway page. My only official giveaways are on my main verified accounts.\""
        },
        {
          "name": "Scam Alert",
          "text": "Requiring a 'transfer fee' or 'tax fee' is the defining characteristic of an advance-fee scam."
        }
      ]
    },
    {
      "id": 7,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Investment Scam",
      "postAuthor": "Crypto Wealth Coach",
      "postHandle": "@CryptoCoach_Max",
      "postTime": "1 day ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Unverified Claim",
        "Too Good to Be True",
        "Unregistered Product",
        "Artificial Urgency"
      ],
      "segments": [
        {
          "id": "7-1",
          "text": "Bitcoin is crashing, but my students are making millions in passive income! ",
          "isDecoy": true,
          "explanation": "The market context might be true, but it's being used to sell a scam."
        },
        {
          "id": "7-2",
          "text": "Our new AI trading bot guarantees a 500% return on your investment in just 3 days. ",
          "isClue": true,
          "explanation": "No legitimate investment can guarantee a 500% return in 3 days. This is mathematically impossible without massive risk.",
          "tactic": "Too Good to Be True"
        },
        {
          "id": "7-3",
          "text": "Fully licensed and approved by the SEC and National Bank. ",
          "isClue": true,
          "explanation": "Checking the SEC database reveals this entity is NOT registered or licensed to solicit investments.",
          "tactic": "Unverified Claim"
        },
        {
          "id": "7-4",
          "text": "Only 5 slots left for the VIP tier! DM me 'INVEST' now."
        }
      ],
      "verifiedSources": [
        {
          "name": "SEC Advisory",
          "text": "\"The entity 'Crypto Wealth Coach' is NOT registered with the Commission and is NOT authorized to solicit investments from the public.\""
        },
        {
          "name": "Financial Experts",
          "text": "Guaranteed high returns in a short period are the primary red flag of a Ponzi scheme."
        }
      ]
    },
    {
      "id": 8,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Charity Appeal",
      "postAuthor": "Help Baby Angel",
      "postHandle": "@BabyAngelFund",
      "postTime": "2 days ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Emotional Manipulation",
        "Vague Attribution",
        "Suspicious Storefront",
        "Unofficial Domain"
      ],
      "segments": [
        {
          "id": "8-1",
          "text": "Please help! Baby Angel needs an emergency liver transplant within 48 hours or she won't survive. "
        },
        {
          "id": "8-2",
          "text": "The hospital bill is already at $200,000 and the doctors are threatening to stop treatment. ",
          "isClue": true,
          "explanation": "Hospitals in most regions cannot legally deny emergency life-saving treatment due to inability to pay (Emergency Medical Act).",
          "tactic": "Emotional Manipulation"
        },
        {
          "id": "8-3",
          "text": "We are begging for your kind hearts. Please send any amount to this CashApp: $HelpBabyAngel (Name: J. Cruz). ",
          "isClue": true,
          "explanation": "The name on the CashApp account does not match the parents' names and the photo is stolen from a 2018 news article in another country.",
          "tactic": "Vague Attribution"
        },
        {
          "id": "8-4",
          "text": "God bless everyone who shares and donates! ",
          "isDecoy": true,
          "explanation": "Scammers use religious or moral appeals to lower people's critical thinking."
        }
      ],
      "verifiedSources": [
        {
          "name": "Reverse Image Search",
          "text": "The photo of the baby was taken from a news article in Brazil from 2018."
        },
        {
          "name": "Hospital Statement",
          "text": "\"We do not have a patient named 'Baby Angel' currently admitted in our pediatric ICU.\""
        }
      ]
    },
    {
      "id": 9,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Flight Promo",
      "postAuthor": "Oceanic Airlines Promos",
      "postHandle": "@Oceanic_SeatSale",
      "postTime": "3 hrs ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Impersonation",
        "Artificial Urgency",
        "Phishing Link",
        "Unverified Claim"
      ],
      "segments": [
        {
          "id": "9-1",
          "text": "$1 FLIGHT ALERT! âœˆï¸ "
        },
        {
          "id": "9-2",
          "text": "Celebrate our anniversary with $1 base fares to ANY domestic destination! ",
          "isDecoy": true,
          "explanation": "Piso fares are real promotions, making this scam highly believable."
        },
        {
          "id": "9-3",
          "text": "This secret promo is only available through our partner travel agency link, not the main website. ",
          "isClue": true,
          "explanation": "Airlines host their major sales directly on their official website or app to drive traffic, not exclusively through unknown partners.",
          "tactic": "Impersonation"
        },
        {
          "id": "9-4",
          "text": "Book within the next 2 hours before seats run out! Click here: www.1dollar-oceanic-flights-2024.net",
          "isClue": true,
          "explanation": "The link points to an unofficial domain designed to steal credit card details.",
          "tactic": "Phishing Link"
        }
      ],
      "verifiedSources": [
        {
          "name": "Official Airline Page",
          "text": "\"All our official seat sales are announced and booked exclusively through oceanicairlines.com. Beware of fake pages.\""
        },
        {
          "name": "Domain Check",
          "text": "The domain '1dollar-oceanic-flights-2024.net' is not owned by the airline."
        }
      ]
    },
    {
      "id": 10,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Data Breach Alert",
      "postAuthor": "CyberSec Alert Philippines",
      "postHandle": "@CyberSecPH_Alerts",
      "postTime": "10 mins ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Unverified Claim",
        "Phishing Link",
        "Impersonation",
        "Emotional Manipulation"
      ],
      "segments": [
        {
          "id": "10-1",
          "text": "URGENT: Major Telecom provider just suffered a massive data breach! "
        },
        {
          "id": "10-2",
          "text": "Over 5 million customer records, including passwords, have been leaked online. ",
          "isDecoy": true,
          "explanation": "While data breaches happen, the claim here is unverified and used to drive panic."
        },
        {
          "id": "10-3",
          "text": "According to an anonymous insider, the company is covering it up. ",
          "isClue": true,
          "tactic": "Unverified Claim",
          "explanation": "No cybersecurity firm or news outlet has corroborated this massive claim."
        },
        {
          "id": "10-4",
          "text": "Check if your number was compromised by entering it at: telecom-breach-check.xyz",
          "isClue": true,
          "tactic": "Phishing Link",
          "explanation": "This is a fake domain designed to harvest active phone numbers."
        }
      ],
      "verifiedSources": [
        {
          "name": "Official Telecom Page",
          "text": "\"We have not experienced any data breaches. Our systems are secure.\""
        },
        {
          "name": "National Privacy Commission",
          "text": "No reports of a data breach from the said Telecom provider."
        }
      ]
    },
    {
      "id": 11,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Gadget Pre-order",
      "postAuthor": "Tech Deals Daily",
      "postHandle": "@GadgetSteals_PH",
      "postTime": "2 hrs ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Suspicious Storefront",
        "Artificial Urgency",
        "Advance Fee Fraud",
        "Too Good to Be True"
      ],
      "segments": [
        {
          "id": "11-1",
          "text": "The highly anticipated X-Phone 15 Pro is finally here! "
        },
        {
          "id": "11-2",
          "text": "We secured 50 units straight from the factory at 60% off the retail price! ",
          "isClue": true,
          "explanation": "Brand new flagship phones are never sold at a 60% discount by third-party sellers.",
          "tactic": "Too Good to Be True"
        },
        {
          "id": "11-3",
          "text": "Pre-order now to reserve yours before they sell out tonight. ",
          "isDecoy": true,
          "explanation": "Pre-orders do sell out, but this urgency is artificial given the impossible price."
        },
        {
          "id": "11-4",
          "text": "Secure your slot by paying a $100 reservation fee to our Gcash: 09123456789. ",
          "isClue": true,
          "explanation": "Legitimate electronics retailers don't ask for reservation fees via personal mobile wallets.",
          "tactic": "Advance Fee Fraud"
        }
      ],
      "verifiedSources": [
        {
          "name": "Official Tech Brand",
          "text": "\"The X-Phone 15 Pro will be available exclusively through our official website and authorized retail partners.\""
        },
        {
          "name": "Consumer Watchdog",
          "text": "Mobile wallet payments for high-end electronics 'reservations' are a common scam tactic."
        }
      ]
    },
    {
      "id": 12,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Miracle Weight Loss Tea",
      "postAuthor": "Slim Life Organics",
      "postHandle": "@SlimLife_Ph",
      "postTime": "14 hrs ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Unregistered Product",
        "Fabricated Quote",
        "Artificial Urgency",
        "Suspicious Storefront"
      ],
      "segments": [
        {
          "id": "12-1",
          "text": "Lose 10kg in just 7 days without diet or exercise! "
        },
        {
          "id": "12-2",
          "text": "This traditional detox tea is FDA approved and highly recommended by top doctors. ",
          "isClue": true,
          "explanation": "Checking the FDA verification portal shows zero records for this brand. It is unregistered.",
          "tactic": "Unregistered Product"
        },
        {
          "id": "12-3",
          "text": "Dr. Santos says: 'I prescribe this to all my patients, it's a medical breakthrough!' ",
          "isClue": true,
          "explanation": "Dr. Santos has publicly denied endorsing this product. The quote is completely invented.",
          "tactic": "Fabricated Quote"
        },
        {
          "id": "12-4",
          "text": "Order now, sale ends in 3 hours! ",
          "isDecoy": true,
          "explanation": "Sales do end, but this is artificial urgency for an illegal product."
        }
      ],
      "verifiedSources": [
        {
          "name": "FDA Database",
          "text": "0 results found for 'Slim Life Organics Detox Tea'. Product is not registered."
        },
        {
          "name": "Dr. Santos Official Page",
          "text": "\"I do not endorse any weight loss teas. Scammers are illegally using my name and photo.\""
        }
      ]
    },
    {
      "id": 13,
      "difficulty": "Hard",
      "badgeColor": "bg-[#EF4444] text-[#FAFAFA] border-[#EF4444]",
      "title": "Fake Police Warrant Warning",
      "postAuthor": "National Police Cybercrime Unit",
      "postHandle": "@CyberPolice_Official",
      "postTime": "1 hr ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Impersonation",
        "Phishing Link",
        "Emotional Manipulation",
        "Artificial Urgency"
      ],
      "segments": [
        {
          "id": "13-1",
          "text": "FINAL NOTICE: An arrest warrant has been issued under your IP address for illegal activities. "
        },
        {
          "id": "13-2",
          "text": "Law enforcement is monitoring this device. ",
          "isDecoy": true,
          "explanation": "Law enforcement does monitor illegal activities, making the threat sound scary and legitimate."
        },
        {
          "id": "13-3",
          "text": "You will be detained within 24 hours unless you immediately clear your record. ",
          "isClue": true,
          "explanation": "Police do not issue public threats of arrest via social media posts to extort immediate compliance.",
          "tactic": "Emotional Manipulation"
        },
        {
          "id": "13-4",
          "text": "Click here to pay the settlement fine and cancel the warrant: police-fine-payment-portal.com",
          "isClue": true,
          "explanation": "Law enforcement agencies do not use unofficial '.com' domains to collect 'settlement fines'.",
          "tactic": "Phishing Link"
        }
      ],
      "verifiedSources": [
        {
          "name": "Official Police Statement",
          "text": "\"We do not send arrest warrants via email or social media, nor do we demand instant payment to 'cancel' them.\""
        },
        {
          "name": "Domain Registry Check",
          "text": "Domain 'police-fine-payment-portal.com' was registered in a foreign jurisdiction yesterday."
        }
      ]
    },
    {
      "id": 14,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Romance Military Scam",
      "postAuthor": "Capt. James Walker",
      "postHandle": "@CaptJames_USMC",
      "postTime": "6 hrs ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Vague Attribution",
        "Advance Fee Fraud",
        "Emotional Manipulation",
        "Impersonation"
      ],
      "segments": [
        {
          "id": "14-1",
          "text": "Currently deployed on a secret peacekeeping mission. Missing home so much. 💔 "
        },
        {
          "id": "14-2",
          "text": "I met someone special online and I want to send her a care package with my savings and medals. ",
          "isDecoy": true,
          "explanation": "Soldiers do send packages, but the context here leads to a classic scam."
        },
        {
          "id": "14-3",
          "text": "But the military won't let me ship it unless she pays the diplomatic courier fee of $500. ",
          "isClue": true,
          "explanation": "There is no such thing as a 'diplomatic courier fee' required by the military to send personal packages.",
          "tactic": "Advance Fee Fraud"
        },
        {
          "id": "14-4",
          "text": "If she doesn't pay it today, the package will be confiscated. Please pray for us! ",
          "isClue": true,
          "explanation": "Scammers use time limits and emotional pleas to rush the victim into paying.",
          "tactic": "Emotional Manipulation"
        }
      ],
      "verifiedSources": [
        {
          "name": "Military Advisory",
          "text": "\"Military personnel do not need anyone to pay 'diplomatic courier fees' to go on leave or send packages. This is a scam.\""
        },
        {
          "name": "Reverse Image Search",
          "text": "The profile photo belongs to a real soldier whose photos have been repeatedly stolen by scammers."
        }
      ]
    },
    {
      "id": 15,
      "difficulty": "Hard",
      "badgeColor": "bg-[#EF4444] text-[#FAFAFA] border-[#EF4444]",
      "title": "Fake Free Pet Adoption",
      "postAuthor": "Golden Retriever Rescue PH",
      "postHandle": "@GoldenRescue_PH",
      "postTime": "3 hrs ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Too Good to Be True",
        "Advance Fee Fraud",
        "Emotional Manipulation",
        "Vague Attribution"
      ],
      "segments": [
        {
          "id": "15-1",
          "text": "We have 5 purebred Golden Retriever puppies left that need loving homes ASAP! 🐶 "
        },
        {
          "id": "15-2",
          "text": "Their previous owner passed away and we cannot afford to feed them. ",
          "isClue": true,
          "explanation": "Scammers often invent tragic backstories to manipulate victims into acting quickly out of pity.",
          "tactic": "Emotional Manipulation"
        },
        {
          "id": "15-3",
          "text": "Adoption is 100% FREE! We just want them to be loved. ",
          "isDecoy": true,
          "explanation": "Legitimate rescues usually charge adoption fees to cover medical costs; completely 'free' purebreds are highly suspect."
        },
        {
          "id": "15-4",
          "text": "You only need to cover the $60 pet transport crate fee via Western Union before we ship them to you. ",
          "isClue": true,
          "explanation": "Asking for shipping or crate fees via untraceable wire transfers for 'free' pets is a hallmark advance-fee fraud.",
          "tactic": "Advance Fee Fraud"
        }
      ],
      "verifiedSources": [
        {
          "name": "Animal Welfare Alert",
          "text": "\"Beware of free pet offers that require upfront shipping or crate fees via wire transfer or mobile wallets.\""
        },
        {
          "name": "Reverse Image Search",
          "text": "The photo of the puppies is a stock image from a pet food blog."
        }
      ]
    },
    {
      "id": 16,
      "difficulty": "Hard",
      "badgeColor": "bg-[#EF4444] text-[#FAFAFA] border-[#EF4444]",
      "title": "Unofficial Crypto Airdrop",
      "postAuthor": "Ethereum Foundation Updates",
      "postHandle": "@ETH_Foundation_Announce",
      "postTime": "10 mins ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Impersonation",
        "Phishing Link",
        "Artificial Urgency",
        "Too Good to Be True"
      ],
      "segments": [
        {
          "id": "16-1",
          "text": "To celebrate our latest network upgrade, we are doing a massive 10,000 ETH airdrop! "
        },
        {
          "id": "16-2",
          "text": "Send anywhere from 0.5 to 5 ETH to the address below, and we will send double the amount back instantly! ",
          "isClue": true,
          "explanation": "No legitimate organization runs 'send us money and we'll double it' promotions. It is a mathematical impossibility.",
          "tactic": "Too Good to Be True"
        },
        {
          "id": "16-3",
          "text": "Only 1,500 ETH left in the pool. Hurry before it runs out! ",
          "isDecoy": true,
          "explanation": "Airdrops do have limits, but here it's used to rush the victim into sending funds."
        },
        {
          "id": "16-4",
          "text": "Verify your wallet and claim here: eth-foundation-airdrop-bonus.network",
          "isClue": true,
          "explanation": "The link directs to a fake domain meant to steal private keys, not the official ethereum.org.",
          "tactic": "Phishing Link"
        }
      ],
      "verifiedSources": [
        {
          "name": "Official Crypto Exchange",
          "text": "\"Any promotion asking you to send crypto in order to receive more back is definitively a scam.\""
        },
        {
          "name": "Domain Authority",
          "text": "Official announcements only happen on ethereum.org. This alternative network domain is malicious."
        }
      ]
    },
    {
      "id": 17,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Counterfeit Designer Goods",
      "postAuthor": "Luxury Outlet Finds",
      "postHandle": "@LuxuryBags_Sale",
      "postTime": "5 hrs ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Suspicious Storefront",
        "Too Good to Be True",
        "Unverified Claim",
        "Artificial Urgency"
      ],
      "segments": [
        {
          "id": "17-1",
          "text": "Massive Warehouse Clearance Sale! Authentic designer bags up to 90% off! "
        },
        {
          "id": "17-2",
          "text": "Get the latest Parisian tote for only $150 (Retail: $1,500). ",
          "isClue": true,
          "explanation": "Authentic luxury brands do not discount their flagship products by 90% online.",
          "tactic": "Too Good to Be True"
        },
        {
          "id": "17-3",
          "text": "100% genuine and comes with authenticity cards and original receipts. ",
          "isDecoy": true,
          "explanation": "Counterfeiters frequently fake authenticity cards and receipts to fool buyers."
        },
        {
          "id": "17-4",
          "text": "Shop now at our pop-up store: luxury-clearance-outlet-24.vip",
          "isClue": true,
          "explanation": "Luxury brands do not use cheap, unverified domains like '.vip' to sell clearance items.",
          "tactic": "Suspicious Storefront"
        }
      ],
      "verifiedSources": [
        {
          "name": "Brand Protection Agency",
          "text": "\"We do not operate online clearance outlets. If the price is too good to be true, it is a counterfeit.\""
        },
        {
          "name": "Scam Advisor",
          "text": "The website 'luxury-clearance-outlet-24.vip' has a trust score of 1/100 and numerous complaints."
        }
      ]
    },
    {
      "id": 18,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Power Outage Notice",
      "postAuthor": "National Grid Advisories",
      "postHandle": "@GridAlerts_Official",
      "postTime": "45 mins ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Fabricated Memo",
        "Impersonation",
        "Unverified Claim",
        "Artificial Urgency"
      ],
      "segments": [
        {
          "id": "18-1",
          "text": "NOTICE OF NATIONWIDE BLACKOUT: Due to a massive grid failure, "
        },
        {
          "id": "18-2",
          "text": "the entire country will experience a total power outage starting at 6:00 PM tonight. ",
          "isClue": true,
          "explanation": "No legitimate news outlet or government energy department has corroborated this massive claim.",
          "tactic": "Unverified Claim"
        },
        {
          "id": "18-3",
          "text": "Prepare your flashlights and stock up on food immediately. ",
          "isDecoy": true,
          "explanation": "It is good practice to be prepared, which makes the panic-inducing message seem helpful."
        },
        {
          "id": "18-4",
          "text": "As per Department of Energy Memo Order #99-X4. Share to warn your families!",
          "isClue": true,
          "explanation": "Checking the Department of Energy records reveals Memo #99-X4 does not exist.",
          "tactic": "Fabricated Memo"
        }
      ],
      "verifiedSources": [
        {
          "name": "Department of Energy",
          "text": "\"There is no impending nationwide blackout. The grid is operating at normal capacity. Memo #99-X4 is fake.\""
        },
        {
          "name": "Major News Outlets",
          "text": "Zero reports of any nationwide grid failure from credible journalists."
        }
      ]
    },
    {
      "id": 19,
      "difficulty": "Hard",
      "badgeColor": "bg-[#EF4444] text-[#FAFAFA] border-[#EF4444]",
      "title": "Lottery Winner Donation Scam",
      "postAuthor": "John Powerball Winner",
      "postHandle": "@John_GivesBack",
      "postTime": "12 hrs ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Too Good to Be True",
        "Advance Fee Fraud",
        "Vague Attribution",
        "Impersonation"
      ],
      "segments": [
        {
          "id": "19-1",
          "text": "Hi, I recently won the $500 Million Powerball jackpot! "
        },
        {
          "id": "19-2",
          "text": "I've decided to donate $50,000 to the first 100 people who reply to this post! ",
          "isClue": true,
          "explanation": "Strangers on the internet do not randomly give away $5 million just for replying to a post.",
          "tactic": "Too Good to Be True"
        },
        {
          "id": "19-3",
          "text": "My lawyer says it's for tax write-off purposes. ",
          "isDecoy": true,
          "explanation": "Using pseudo-legal terms like 'tax write-off' makes the scam sound credible to victims."
        },
        {
          "id": "19-4",
          "text": "Just DM my financial manager 'Agent Smith' and pay the $150 state clearance fee to get your $50,000.",
          "isClue": true,
          "explanation": "Asking for an upfront 'clearance fee' to receive a massive cash prize is classic advance-fee fraud.",
          "tactic": "Advance Fee Fraud"
        }
      ],
      "verifiedSources": [
        {
          "name": "Lottery Commission",
          "text": "\"Lottery winners do not conduct random giveaways on social media. Any request for a clearance fee is a scam.\""
        },
        {
          "name": "News Verification",
          "text": "The real jackpot winner has requested anonymity and has no active social media accounts."
        }
      ]
    },
    {
      "id": 20,
      "difficulty": "Medium",
      "badgeColor": "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
      "title": "Fake Celebrity Passing",
      "postAuthor": "Breaking News Network",
      "postHandle": "@Breaking_UpdatesNow",
      "postTime": "20 mins ago",
      "correctVerdict": "Fake",
      "cluesNeeded": 2,
      "tacticOptions": [
        "Emotional Manipulation",
        "Phishing Link",
        "Unverified Claim",
        "Impersonation"
      ],
      "segments": [
        {
          "id": "20-1",
          "text": "RIP to a legend. 😭 World-famous actor Jackie Chan has just passed away from a sudden heart attack. "
        },
        {
          "id": "20-2",
          "text": "Our hearts are broken. He was a true martial arts icon. ",
          "isDecoy": true,
          "explanation": "He is a famous icon, making the emotional impact of the news very high and triggering sharing."
        },
        {
          "id": "20-3",
          "text": "His family has just released a heartbreaking final video. ",
          "isClue": true,
          "explanation": "No reputable news outlets have confirmed this massive story. It is a completely unverified claim.",
          "tactic": "Unverified Claim"
        },
        {
          "id": "20-4",
          "text": "Watch the unedited footage of his final moments here: celebrity-news-exclusive-video.tv",
          "isClue": true,
          "explanation": "The link does not go to a news site, but to a malicious domain designed to steal your login credentials.",
          "tactic": "Phishing Link"
        }
      ],
      "verifiedSources": [
        {
          "name": "Actor's Official Agent",
          "text": "\"Jackie Chan is alive and well, currently filming his next project. Please do not fall for these death hoaxes.\""
        },
        {
          "name": "Major News Networks",
          "text": "Zero coverage of this alleged passing on CNN, BBC, or Reuters."
        }
      ]
    }
  ],
  "TACTIC_DESCRIPTIONS": {
    "Vague Attribution": "Citing unnamed or generic sources (e.g. 'an official') to avoid verification.",
    "Artificial Urgency": "Creating fake time pressure (e.g. 'hurry', 'ends tonight') to rush decisions.",
    "Phishing Link": "Using deceptive URLs that look official but steal your information.",
    "Advance Fee Fraud": "Asking for an upfront payment or processing fee for a 'free' reward.",
    "Unofficial Domain": "Directing users to sketchy, non-official websites or personal messages.",
    "Fabricated Quote": "Inventing fake statements and attributing them to celebrities or authority figures.",
    "Unregistered Product": "Selling items claiming health benefits without FDA approval or registration.",
    "Suspicious Storefront": "Using unverified, temporary e-commerce sites to sell dubious products.",
    "Unverified Claim": "Making bold, official-sounding statements without any supporting evidence.",
    "Fabricated Memo": "Referencing fake official documents or memo numbers to appear legitimate.",
    "Impersonation": "Pretending to be a trusted entity like a bank, company, or government agency.",
    "Too Good to Be True": "Offering extravagant rewards for minimal effort.",
    "Emotional Manipulation": "Exploiting fear, pity, or tragedy to bypass critical thinking."
  }
}

export default case001Data;