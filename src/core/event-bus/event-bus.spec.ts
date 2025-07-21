import { expect } from 'chai';
import sinon from 'sinon';
import EventBus from './event-bus';

describe.only('EventBus', () => {
    let eventBus: EventBus<string>;
    const testEvent = 'testEvent' as const;
    const anotherEvent = 'anotherEvent' as const;

    beforeEach(() => {
        eventBus = new EventBus();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('on()', () => {
        it('should register callback for event', () => {
            const callback = sinon.spy();
            eventBus.on(testEvent, callback);

            expect(eventBus['listeners'][testEvent]).to.include(callback);
        });

        it('should register multiple callbacks for the same event', () => {
            const callback1 = sinon.spy();
            const callback2 = sinon.spy();

            eventBus.on(testEvent, callback1);
            eventBus.on(testEvent, callback2);

            expect(eventBus['listeners'][testEvent]).to.have.lengthOf(2);
            expect(eventBus['listeners'][testEvent]).to.include(callback1);
            expect(eventBus['listeners'][testEvent]).to.include(callback2);
        });

        it('should register callbacks for different events', () => {
            const callback1 = sinon.spy();
            const callback2 = sinon.spy();

            eventBus.on(testEvent, callback1);
            eventBus.on(anotherEvent, callback2);

            expect(eventBus['listeners'][testEvent]).to.include(callback1);
            expect(eventBus['listeners'][anotherEvent]).to.include(callback2);
        });
    });

    describe('emit()', () => {
        it('should call all registered callbacks', () => {
            const callback1 = sinon.spy();
            const callback2 = sinon.spy();

            eventBus.on(testEvent, callback1);
            eventBus.on(testEvent, callback2);
            eventBus.emit(testEvent);

            expect(callback1.calledOnce).to.be.true;
            expect(callback2.calledOnce).to.be.true;
        });

        it('should pass arguments to callbacks', () => {
            const callback = sinon.spy();
            const testArgs = [1, 'two', { three: 3 }];

            eventBus.on(testEvent, callback);
            eventBus.emit(testEvent, ...testArgs);

            expect(callback.calledWith(...testArgs)).to.be.true;
        });

        it('should log error for non-existent event', () => {
            const consoleStub = sinon.stub(console, 'error');

            eventBus.emit('nonExistentEvent');

            expect(consoleStub.calledWith('Не зарегистрировано событие: nonExistentEvent')).to.be.true;
        });
    });

    describe('off()', () => {
        it('should remove specific callback', () => {
            const callback1 = sinon.spy();
            const callback2 = sinon.spy();

            eventBus.on(testEvent, callback1);
            eventBus.on(testEvent, callback2);
            eventBus.off(testEvent, callback1);

            expect(eventBus['listeners'][testEvent]).to.have.lengthOf(1);
            expect(eventBus['listeners'][testEvent]).to.include(callback2);
            expect(eventBus['listeners'][testEvent]).not.to.include(callback1);
        });

        it('should throw error when removing from non-existent event', () => {
            const callback = sinon.spy();

            expect(() => eventBus.off('nonExistentEvent', callback))
                .to.throw('Не зарегистрировано событие: nonExistentEvent');
        });

        it('should not fail when removing non-existent callback', () => {
            const callback1 = sinon.spy();
            const callback2 = sinon.spy();

            eventBus.on(testEvent, callback1);

            expect(() => eventBus.off(testEvent, callback2)).not.to.throw();
            expect(eventBus['listeners'][testEvent]).to.have.lengthOf(1);
        });
    });

    describe('once()', () => {
        it('should call callback only once', () => {
            const callback = sinon.spy();

            eventBus.once(testEvent, callback);
            eventBus.emit(testEvent);
            eventBus.emit(testEvent);

            expect(callback.calledOnce).to.be.true;
        });

        it('should pass arguments to callback', () => {
            const callback = sinon.spy();
            const testArgs = ['arg1', 2, { key: 'value' }];

            eventBus.once(testEvent, callback);
            eventBus.emit(testEvent, ...testArgs);

            expect(callback.calledWith(...testArgs)).to.be.true;
        });

        it('should automatically unsubscribe after first emit', () => {
            const callback = sinon.spy();

            eventBus.once(testEvent, callback);
            eventBus.emit(testEvent);

            expect(callback.calledOnce).to.be.true;
            expect(eventBus['listeners'][testEvent]).to.be.empty;
        });
    });
});
