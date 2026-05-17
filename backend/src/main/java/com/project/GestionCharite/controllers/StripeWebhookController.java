package com.project.GestionCharite.controllers;

import com.project.GestionCharite.services.DonationService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.net.Webhook;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.stripe.exception.EventDataObjectDeserializationException;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final DonationService donationService;

    @Value("${stripe.webhook-secret}")
    private String endpointSecret;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event = null;

        try {
            // 2. Try to verify the signature
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error");
        }

        // 3. Check the event type
        if ("payment_intent.succeeded".equals(event.getType())) {
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            
            PaymentIntent paymentIntent = null;
            
            try {
                // Try safe deserialization first
                if (dataObjectDeserializer.getObject().isPresent()) {
                    paymentIntent = (PaymentIntent) dataObjectDeserializer.getObject().get();
                } else {
                    // 🛠️ Force deserialization if versions don't match
                    paymentIntent = (PaymentIntent) dataObjectDeserializer.deserializeUnsafe();
                }
            } catch (EventDataObjectDeserializationException e) {
                // 🛡️ JAVA REQUIRES THIS CATCH BLOCK!
                System.out.println("❌ 2.5 DESERIALIZATION FAILED: " + e.getMessage());
            }

            if (paymentIntent != null) {
                
                try {
                    // Trigger the fulfillment logic in your service
                    donationService.fulfillDonation(paymentIntent.getId());
                } catch (Exception e) {
                    System.out.println("❌ 4. DATABASE ERROR: " + e.getMessage());
                }
            }
        } else {
            System.out.println("⚠️ 3. IGNORED EVENT TYPE: " + event.getType());
        }

        return ResponseEntity.ok("Webhook received");
    }
}