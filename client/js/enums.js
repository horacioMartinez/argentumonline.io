define(function () {

    var Enums = {
        Heading: {
            norte: 1,
            este: 2,
            sur: 3,
            oeste: 4
        },

        eMessage: {
            DontSeeAnything : 0,
            NPCSwing : 1,
            NPCKillUser : 2,
            BlockedWithShieldUser : 3,
            BlockedWithShieldother : 4,
            UserSwing : 5,
            SafeModeOn : 6,
            SafeModeOff : 7,
            ResuscitationSafeOff : 8,
            ResuscitationSafeOn : 9,
            NobilityLost : 10,
            CantUseWhileMeditating : 11,
            NPCHitUser : 12,
            UserHitNPC : 13,
            UserAttackedSwing : 14,
            UserHittedByUser : 15,
            UserHittedUser : 16,
            WorkRequestTarget : 17,
            HaveKilledUser : 18,
            UserKill : 19,
            EarnExp : 20,
            Home : 21,
            CancelHome : 22,
            FinishHome : 23
        }

    };
    return Enums;
});