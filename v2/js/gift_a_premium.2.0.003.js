var normalPriceid,USERNAME="mp-web-open",PASSWORD="oK%b5%Ap8O9z$JwcMkDm",QTY_LIMIT=10,MPWebAPIGiftAPremiumBaseURL="https://us-central1-muslim-pro-app.cloudfunctions.net/MPWebAPIGiftAPremiumV2/",purchaseFormInitialState={name:"",email:"",confirmEmail:"",qty:1,unitPrice:0,totalPrice:0,purchaseFormValid:!1,discountCode:""},sendGiftInitialState={buyerEmail:"",buyerName:"",recipientEmail:"",recipientConfirmEmail:"",recipientName:"",code:"",personalNote:"",messageFormValid:!1},purchaseFormState=Object.assign(purchaseFormInitialState,{}),sendGiftState=Object.assign(sendGiftInitialState,{}),stripePayment="undefined"!=typeof StripePayment?new StripePayment:null;function fetchUnitPrice(){axios.get(MPWebAPIGiftAPremiumBaseURL).then(function(e){purchaseFormState.unitPrice=e.data&&e.data.unit_price,e.data&&(e.data.rate&&e.data.currency_code&&(purchaseFormState.localExchangeRate=e.data.rate,purchaseFormState.localCurrencyCode=e.data.currency_code),e.data.price_id&&(purchaseFormState.priceId=e.data.price_id,normalPriceid=purchaseFormState.priceId)),updateTotalPrice(),$(".gift_a_premium .gift_a_premium__purchase_form input").each(function(){$(this).prop("disabled",!1)})})}function verifyDiscountCode(e){toggleDiscountLoading(!0);var t=e.discountCode,a=(e.debug,MPWebAPIGiftAPremiumBaseURL+"verify_discount_code/?discountCode="+t);axios.get(a).then(function(e){e.data&&"success"===e.data.result&&e.data.discountedUnitPrice?(purchaseFormState.discountCode=t,purchaseFormState.discountedUnitPrice=e.data.discountedUnitPrice,purchaseFormState.priceId=e.data.priceId,updateTotalPrice(),toggleDiscountWrapper()):($(".gift_a_premium .gift_a_premium__purchase_form .discount_error").show(),clearDiscount()),toggleDiscountLoading(!1)})}function stripeCheckoutOnetimePayment(){renderPurchaseResponse("1"),stripePayment.checkoutOnetimePayment({apiUrl:MPWebAPIGiftAPremiumBaseURL,successUrl:"https://www.muslimpro.com/"+window.languageCode+"/payment-successful?qty="+purchaseFormState.qty+"&buyer_email="+purchaseFormState.email+"&buyer_name="+encodeURIComponent(purchaseFormState.name)+"&discount_code="+(purchaseFormState.discountCode?purchaseFormState.discountCode:""),cancelUrl:window.location.href,itemList:[{priceId:purchaseFormState.priceId,quantity:purchaseFormState.qty}],discountCode:purchaseFormState.discountCode,countryCode:purchaseFormState.countryCode,onError:function(){renderPurchaseResponse("-1")}})}function clearDiscount(){delete purchaseFormState.discountCode,delete purchaseFormState.discountedUnitPrice,delete purchaseFormState.discountedTotalPrice,purchaseFormState.priceId=normalPriceid,toggleDiscountWrapper(!0),updateTotalPrice()}function toggleDiscountWrapper(e){e?($(".gift_a_premium .gift_a_premium__purchase_form .discount_remove_wrapper").hide(),$(".gift_a_premium .gift_a_premium__purchase_form .discount_wrapper").show()):($(".gift_a_premium .gift_a_premium__purchase_form .discount_wrapper").hide(),$(".gift_a_premium .gift_a_premium__purchase_form .discount_remove_wrapper").show())}function toggleDiscountLoading(e){e?$(".gift_a_premium .gift_a_premium__purchase_form .discount_loading").show():$(".gift_a_premium .gift_a_premium__purchase_form .discount_loading").hide()}function renderOldPrice(e,t){e&&purchaseFormState.discountedTotalPrice?($(".gift_a_premium .gift_a_premium__purchase_form .old_total_amount").text(t+" "+(purchaseFormState.totalPrice*(purchaseFormState.localExchangeRate||1)).toFixed(2)),$(".gift_a_premium .gift_a_premium__purchase_form .old_price_wrapper").show()):$(".gift_a_premium .gift_a_premium__purchase_form .old_price_wrapper").hide()}function validatePurchaseForm(){$(".gift_a_premium .gift_a_premium__purchase_form .error").hide();var e=purchaseFormState.name,t=purchaseFormState.email,a=purchaseFormState.confirmEmail,i=purchaseFormState.qty;fUnitPrice=purchaseFormState.unitPrice,purchaseFormState.purchaseFormValid=!1,!e||""===e.trim()||32<e.length?$(".gift_a_premium .gift_a_premium__purchase_form .name_error").show():t&&a&&t===a?QTY_LIMIT<i?$(".gift_a_premium .gift_a_premium__purchase_form .qty_error").show():(purchaseFormState.purchaseFormValid=!0,$(".gift_a_premium .gift_a_premium__purchase_form .purchase_btn").prop("disabled",!1)):$(".gift_a_premium .gift_a_premium__purchase_form .email_error").show()}function updateTotalPrice(){var e=purchaseFormState.localCurrencyCode?purchaseFormState.localCurrencyCode+" ":"US $";purchaseFormState.totalPrice=parseFloat((purchaseFormState.qty*purchaseFormState.unitPrice).toFixed(2)),purchaseFormState.discountCode&&purchaseFormState.discountedUnitPrice&&(purchaseFormState.discountedTotalPrice=parseFloat((purchaseFormState.qty*purchaseFormState.discountedUnitPrice).toFixed(2)));var t=purchaseFormState.discountedTotalPrice||purchaseFormState.totalPrice,a=purchaseFormState.localExchangeRate?parseFloat((t*purchaseFormState.localExchangeRate).toFixed(2)):t;$(".gift_a_premium .gift_a_premium__purchase_form .total_amount h3").text(e+a),renderOldPrice(!0,e)}function callMpGiftAPremiumApi(e){axios.post(MPWebAPIGiftAPremiumBaseURL,{orderID:e.orderID,sessionId:e.sessionId,name:e.name?e.name:purchaseFormState.name,email:e.email?e.email:purchaseFormState.email,discountCode:e.discountCode?e.discountCode:purchaseFormState.discountCode,paymentMethod:e.paymentMethod,qty:parseInt(e.qty||0)||parseInt(purchaseFormState.qty),languageCode:window.languageCode}).then(function(e){$(".payment_success_page_msg").hide(),e.data&&"success"===e.data.result?$(".payment_success_page_msg.success_msg").show():$(".payment_success_page_msg.error_msg").show(),showBackLink()}).catch(function(e){console.log("Error occured on MpGiftAPremiumAPI:",e),renderPurchaseResponse("-2"),showBackLink()})}function renderPurchaseResponse(e){$(".gift_a_premium .gift_a_premium__purchase_form .purchase_resp").hide(),"-2"===e?$(".gift_a_premium .gift_a_premium__purchase_form .error_2").show():"-1"===e?$(".gift_a_premium .gift_a_premium__purchase_form .error_1").show():"1"===e?$(".gift_a_premium .gift_a_premium__purchase_form .success_1").show():"2"===e&&$(".gift_a_premium .gift_a_premium__purchase_form .success_2").show()}function validateMessageForm(){$(".gift_a_premium .gift_a_premium__gift_send .error").hide();var e=sendGiftInitialState.buyerName,t=sendGiftInitialState.recipientEmail,a=sendGiftInitialState.recipientConfirmEmail,i=sendGiftInitialState.recipientName,r=(sendGiftInitialState.code,sendGiftInitialState.personalNote);!e||""===e.trim()||32<e.length?$(".gift_a_premium .gift_a_premium__gift_send .b_name_error").show():!i||""===i.trim()||32<i.length?$(".gift_a_premium .gift_a_premium__gift_send .r_name_error").show():t&&a&&t===a?r&&250<r.length?$(".gift_a_premium .gift_a_premium__gift_send .personal_note_error").show():(sendGiftInitialState.messageFormValid=!0,$(".gift_a_premium .gift_a_premium__gift_send .message_send_btn").prop("disabled",!1)):$(".gift_a_premium .gift_a_premium__gift_send .r_email_error").show()}function prefillMessageForm(e){e&&(e.buyerEmail&&$(".gift_a_premium__gift_send .buyer_email").val(e.buyerEmail),e.code&&$(".gift_a_premium__gift_send .code").val(e.code))}function showRecaptchaError(){console.log("Recaptcha error"),$(".gift_a_premium .gift_a_premium__message_form .message_send_resp").hide(),$(".gift_a_premium .gift_a_premium__message_form .message_send_resp.error_2").show(),grecaptcha.reset()}function showMessageSendError(){$(".gift_a_premium .gift_a_premium__message_form .message_send_resp").hide(),$(".gift_a_premium .gift_a_premium__message_form .message_send_resp.error_1").show(),setTimeout(function(){$(".gift_a_premium .gift_a_premium__message_form .message_send_resp").hide()},5e3)}function showMessageSendSuccess(){$(".gift_a_premium .gift_a_premium__message_form .message_send_resp").hide(),$(".gift_a_premium .gift_a_premium__message_form .message_send_resp.success_1").show(),setTimeout(function(){$(".gift_a_premium .gift_a_premium__message_form .message_send_resp").hide()},5e3)}function sendGiftButtonActionStatus(e){var t=getUrlParams(window.location.search);console.log(t);var a=!1;"gift_btn_txt"===t.via&&(a=!0),e?a?gtag("event","PURCHASE_SUCCESS_VIA_BUY_A_GIFT_TEXT",{event_label:"PURCHASE_SUCCESS",event_category:"GIFT_A_PREMIUM",non_interaction:!1,description:"Gift a Premium Purchase was success via Buy A Gift text Button Click."}):gtag("event","PURCHASE_SUCCESS_VIA_BUY_PREMIUM_TEXT",{event_label:"PURCHASE_SUCCESS",event_category:"GIFT_A_PREMIUM",non_interaction:!1,description:"Gift a Premium Purchase was success via Buy Premium text Button Click."}):a?gtag("event","PURCHASE_FAILED_VIA_BUY_A_GIFT_TEXT",{event_label:"PURCHASE_FAIL",event_category:"GIFT_A_PREMIUM",non_interaction:!1,description:"Gift a Premium Purchase was failed via Buy a gift text Button Click."}):gtag("event","PURCHASE_FAILED_BUY_PREMIUM_TEXT",{event_label:"PURCHASE_FAIL",event_category:"GIFT_A_PREMIUM",non_interaction:!1,description:"Gift a Premium Purchase was failed via Buy premium text Button Click."})}function getUrlParams(e){for(var t=(e=e.replace("?","")).split("&"),a={},i=0;i<t.length;i++){var r=t[i].split("="),_=decodeURIComponent(r[0]),m=decodeURIComponent(r[1]);if(void 0===a[_])a[_]=decodeURIComponent(m);else if("string"==typeof a[_]){var o=[a[_],decodeURIComponent(m)];a[_]=o}else a[_].push(decodeURIComponent(m))}return a}function showMessageForm(){$(".gift_a_premium .gift_a_premium__purchase_form").hide(),$(".gift_a_premium__gift_send").show()}function showPurchaseForm(){$(".gift_a_premium .gift_a_premium__purchase_form").show(),$(".gift_a_premium__gift_send").hide()}function dataCallback(e){console.log("Captcha dataCallback",e)}function trackGAConversion(){if(window.campaignId)try{gtag_report_conversion()}catch(e){console.log("Failed to execute gtag_report_conversion",e)}}function showBackLink(){$(".back__link").addClass("back__link-show")}$(document).ready(function(){var e=getUrlParams(window.location.search);"true"===e.sendMsg?(showMessageForm(),prefillMessageForm(e)):(showPurchaseForm(),fetchUnitPrice()),$(".gift_a_premium .gift_a_premium__purchase_form .toggle_link").click(function(){showMessageForm()}),$(".gift_a_premium__gift_send .toggle_link").click(function(){purchaseFormState.totalPrice||fetchUnitPrice(),showPurchaseForm()}),$(".gift_a_premium .gift_a_premium__purchase_form input").keyup(function(){purchaseFormState.name=$(".gift_a_premium .gift_a_premium__purchase_form .name").val(),purchaseFormState.email=$(".gift_a_premium .gift_a_premium__purchase_form .email").val(),purchaseFormState.confirmEmail=$(".gift_a_premium .gift_a_premium__purchase_form .confirm_email").val(),purchaseFormState.qty=$(".gift_a_premium .gift_a_premium__purchase_form .qty").val(),updateTotalPrice(),validatePurchaseForm()}),$(".gift_a_premium .gift_a_premium__purchase_form .qty").on("input",function(){purchaseFormState.qty=$(this).val(),updateTotalPrice(),validatePurchaseForm()}),$(".gift_a_premium .gift_a_premium__purchase_form").submit(function(e){e.preventDefault(),purchaseFormState.purchaseFormValid&&stripeCheckoutOnetimePayment(),trackGAConversion()}),$(".gift_a_premium .gift_a_premium__purchase_form .discount_field").on("input",function(e){var t=$(".discount_field").val();$(".discount_field").val(t.toLowerCase())}),$(".gift_a_premium .gift_a_premium__purchase_form .discount_btn").click(function(e){e.preventDefault(),verifyDiscountCode({discountCode:$(".discount_field").val()})}),$(".gift_a_premium .gift_a_premium__purchase_form .remove_discount").click(function(e){e.preventDefault(),$(".discount_field").val(""),clearDiscount()}),$(".gift_a_premium .gift_a_premium__message_form").submit(function(e){e.preventDefault();var t=grecaptcha.getResponse();$.ajax({url:"https://us-central1-muslim-pro-app.cloudfunctions.net/verifyRecaptcha",method:"POST",headers:{Authorization:"Basic "+btoa(USERNAME+":"+PASSWORD)},data:{captchaResponse:t,captchaResource:"mp_website"},success:function(e){$(".gift_a_premium .gift_a_premium__message_form .message_send_resp").hide();var t="buyerName="+sendGiftInitialState.buyerName+"&buyerEmail="+sendGiftInitialState.buyerEmail+"&email="+sendGiftInitialState.recipientEmail+"&recipientName="+sendGiftInitialState.recipientName+"&personalNote="+sendGiftInitialState.personalNote+"&code="+sendGiftInitialState.code+"&type=gift_a_premium_send_msg";$.ajax({url:"https://us-central1-muslim-pro-app.cloudfunctions.net/sendEmail",method:"POST",data:t,headers:{Authorization:"Basic "+btoa(USERNAME+":"+PASSWORD)},success:function(e){showMessageSendSuccess()},error:function(e){showMessageSendError()}})},error:function(e){showRecaptchaError()}});$(".gift_a_premium .gift_a_premium__message_form .message_send_resp.success_1").show()}),$(".gift_a_premium__message_form input, .gift_a_premium__message_form textarea").keyup(function(){sendGiftInitialState.buyerName=$(".gift_a_premium__message_form .buyer_name").val(),sendGiftInitialState.buyerEmail=$(".gift_a_premium__message_form .buyer_email").val(),sendGiftInitialState.recipientEmail=$(".gift_a_premium__message_form .recipient_email").val(),sendGiftInitialState.recipientConfirmEmail=$(".gift_a_premium__message_form .recipient_confirm_email").val(),sendGiftInitialState.recipientName=$(".gift_a_premium__message_form .recipient_name").val(),sendGiftInitialState.code=$(".gift_a_premium__message_form .code").val(),sendGiftInitialState.personalNote=$(".gift_a_premium__message_form .personal_note").val(),validateMessageForm()})});