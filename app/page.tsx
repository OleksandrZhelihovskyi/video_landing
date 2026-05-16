import Image from "next/image";
import {
  Button,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from "react-bootstrap";

export default function Home() {
  return (
    <>
      <section>
        <div className="flex items-center justify-center relative">
          <div>
            <img
              src="/group_2.svg"
              alt="Main Image"
              className="min-h-[850px] absolute z-10"
            />
            <div className="container-fluid first-section relative min-h-[850px] flex items-center justify-center w-full flex-col">
              <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6 mx-auto text-center w-[60%]">
                  <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg animate-fade-in-up delay-100">
                    Video Speed Analysis for Road Accidents
                  </h1>
                  <h2 className="text-2xl font-semibold text-center text-white drop-shadow-lg animate-fade-in-up delay-300">
                    Determine Vehicle Speed from Accident Footage
                  </h2>
                  <h4 className="text-lg text-center text-white drop-shadow-lg animate-fade-in-up delay-500">
                    If you need to find out how fast a vehicle was moving at the
                    time of an accident — upload the street surveillance footage
                    and get an estimated speed reading. Useful as a preliminary
                    check before ordering an official forensic examination.
                  </h4>
                </div>
              </div>
              <Button
                variant="warning"
                size="lg"
                className="relative z-20"
                href="#faq"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center relative" id="faq">
        <div className=" max-w-[2520px] w-full bg-gray-950 ">
          <div className="container mx-auto px-4">
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
                      accident and need to know the approximate speed of a
                      vehicle at the moment of the incident. It is especially
                      relevant before filing an insurance claim, preparing for
                      court proceedings, or consulting with a traffic accident
                      expert. Upload footage from any street surveillance camera
                      and get a speed estimate within hours.
                    </AccordionBody>
                  </AccordionItem>

                  <AccordionItem eventKey="1">
                    <AccordionHeader>
                      How does the analysis work?
                    </AccordionHeader>
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
                      other technical limitations — you pay nothing. No result,
                      no charge.
                    </AccordionBody>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
