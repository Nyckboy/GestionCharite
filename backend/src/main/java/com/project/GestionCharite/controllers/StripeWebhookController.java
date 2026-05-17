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

        System.out.println("=============================================");
        System.out.println("🚨 1. WEBHOOK RECEIVED! Signature: " + sigHeader);
        
        Event event = null;

        try {
            // 2. Try to verify the signature
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            System.out.println("✅ 2. SIGNATURE VERIFIED! Event Type: " + event.getType());
            
        } catch (SignatureVerificationException e) {
            // IF IT FAILS HERE, your application.yml secret is wrong
            System.out.println("❌ 2. SIGNATURE MISMATCH!");
            System.out.println("My YML Secret is: " + endpointSecret);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            System.out.println("❌ 2. UNKNOWN ERROR: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error");
        }

        // 3. Check the event type
        if ("payment_intent.succeeded".equals(event.getType())) {
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            
            if (dataObjectDeserializer.getObject().isPresent()) {
                PaymentIntent paymentIntent = (PaymentIntent) dataObjectDeserializer.getObject().get();
                System.out.println("💰 3. PROCESSING PAYMENT: " + paymentIntent.getId());
                
                try {
                    // Trigger the fulfillment logic in your service
                    donationService.fulfillDonation(paymentIntent.getId());
                    System.out.println("🎉 4. DATABASE UPDATED SUCCESSFULLY!");
                } catch (Exception e) {
                    // IF IT FAILS HERE, it couldn't find the transaction ID in the database
                    System.out.println("❌ 4. DATABASE ERROR: " + e.getMessage());
                }
            }
        } else {
            System.out.println("⚠️ 3. IGNORED EVENT TYPE: " + event.getType());
        }

        System.out.println("=============================================");
        return ResponseEntity.ok("Webhook received");
    }
}