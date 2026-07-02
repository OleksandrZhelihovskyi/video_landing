"use client";

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
} from "react-bootstrap";
import { Step, Stepper } from "react-form-stepper";
import dynamic from 'next/dynamic';
const StepperComponent = dynamic(() => import('./CustomStepper'), {
  ssr: false,
});

export function HomePageClient() {
  return (
    <>
      <section id="top">
        <div className="flex items-center justify-center relative">
          <div className="container first-section relative min-h-[680px] flex items-center justify-center w-full flex-col">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 mx-auto text-center w-[60%]">
                <h2 className="text-4xl font-bold text-center text-white drop-shadow-lg animate-fade-in-up delay-100">
                  Video Speed Analysis for Road Accidents
                </h2>
                <h3 className="text-2xl font-semibold text-center text-white drop-shadow-lg animate-fade-in-up delay-300">
                  Determine Vehicle Speed from Accident Footage
                </h3>
                <h5 className="text-lg text-center text-white drop-shadow-lg animate-fade-in-up delay-500">
                  If you need to find out how fast a vehicle was moving at the
                  time of an accident — upload the street surveillance footage
                  and get an estimated speed reading. Useful as a preliminary
                  check before ordering an official forensic examination.
                </h5>
              </div>
            </div>
            <Button
              variant="warning"
              size="lg"
              className="relative z-20"
              href="#stepper-container"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center relative" id="faq">
        <div className="container mx-auto px-4 bg-gray-950">
          <h2 className="text-3xl font-bold text-center text-white mb-10 animate-fade-in-up">
            Frequently Asked Questions
          </h2>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10" style={{ maxWidth: "100%" }}>
              <Accordion
                defaultActiveKey="0"
                className="animate-fade-in-up delay-100 accordion-dark"
              >
                <AccordionItem eventKey="0">
                  <AccordionHeader>
                    When do you need this service?
                  </AccordionHeader>
                  <AccordionBody>
                    This service is useful when you are involved in a road
                    accident and need to know the approximate speed of a vehicle
                    at the moment of the incident. It is especially relevant
                    before filing an insurance claim, preparing for court
                    proceedings, or consulting with a traffic accident expert.
                    Upload footage from any street surveillance camera and get a
                    speed estimate within hours.
                  </AccordionBody>
                </AccordionItem>

                <AccordionItem eventKey="1">
                  <AccordionHeader>How does the analysis work?</AccordionHeader>
                  <AccordionBody>
                    Our tool is powered by artificial intelligence. The system
                    analyzes the video frame by frame, tracks the vehicle's
                    movement across reference points, and calculates its speed
                    based on object displacement and camera parameters. No
                    manual measurements — the AI handles the entire process
                    automatically, delivering fast and objective results.
                  </AccordionBody>
                </AccordionItem>

                <AccordionItem eventKey="2">
                  <AccordionHeader>How much does it cost?</AccordionHeader>
                  <AccordionBody>
                    We charge only for results. If our system is unable to
                    determine the vehicle's speed from the provided footage —
                    due to poor video quality, insufficient camera angle, or
                    other technical limitations — you pay nothing. No result, no
                    charge.
                  </AccordionBody>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center relative" id="faq">
        <div className="container mx-auto px-4 bg-gray-950">
          <h2 className="text-3xl font-bold text-center text-white mb-10 animate-fade-in-up">
            Analyse your video now
          </h2>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10" style={{ maxWidth: "100%" }} id="stepper-container">
              <StepperComponent />
            </div>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-gray-950 px-4 pb-8 pt-12">
        <div className="container mx-auto">
          <div className="footer-strip overflow-hidden rounded-full border border-white/10 bg-white/[0.04] shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm">
            <div className="footer-marquee flex min-w-max items-center gap-4 px-5 py-4 text-sm md:text-[0.95rem]">
              <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 font-semibold uppercase tracking-[0.2em] text-amber-200">
                Video Analysis
              </span>
              <span className="text-white/70">
                Preliminary AI-based assessment for road accident footage
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
              <a className="text-white transition-colors hover:text-amber-300" href="#stepper-container">
                Upload video
              </a>
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <a className="text-white transition-colors hover:text-amber-300" href="#faq">
                FAQ
              </a>
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="text-white/60">No result, no charge</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
              <a className="text-white transition-colors hover:text-amber-300" href="#top">
                Back to top
              </a>
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="text-white/70">
                Calibration and speed estimate in one flow
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
              <span className="rounded-full border border-white/10 px-3 py-1 text-white/70">
                Built for fast pre-checks
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
